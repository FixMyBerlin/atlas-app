// We use bun.sh to run this file
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import slugify from 'slugify'
import { parseArgs } from 'util'

import { createUpload, getRegions } from './api'
import { green, yellow, inverse, red } from './log'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import pluralize from 'pluralize'

const pp = path.parse
const geoJsonFolder = 'scripts/StaticDatasets/geojson'
const tmpDir = path.join(os.tmpdir(), 'pmtiles')
const regions = await getRegions()
const existingRegionSlugs = regions.map((region) => region.slug)

// script can be run with --dry-run to just run all checks
// without transforming and processing geojsons, uploading pmtiles and saving to db
// use --keep-tmp to keep temporary generated files
const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    'dry-run': { type: 'boolean' },
    'keep-tmp': { type: 'boolean' },
  },
  strict: true,
  allowPositionals: true,
})

const dryRun = !!values['dry-run']
const keepTemporaryFiles = !!values['keep-tmp']

const generatePMTilesFile = (inputFile: string, outputFile: string) => {
  if (dryRun) return '/tmp/does-not-exist.pmtiles'
  Bun.spawnSync(
    [
      'tippecanoe',
      `--output=${outputFile}`,
      '--force',
      '--maximum-zoom=g', // Automatically choose a maxzoom that should be sufficient to clearly distinguish the features and the detail within each feature https://github.com/felt/tippecanoe#zoom-levels
      '-rg', // If you use -rg, it will guess a drop rate that will keep at most 50,000 features in the densest tile https://github.com/felt/tippecanoe#dropping-a-fixed-fraction-of-features-by-zoom-level
      '--drop-densest-as-needed', // https://github.com/felt/tippecanoe?tab=readme-ov-file#dropping-a-fraction-of-features-to-keep-under-tile-size-limits
      '--extend-zooms-if-still-dropping', // https://github.com/felt/tippecanoe?tab=readme-ov-file#zoom-levels
      '--layer=default',
      inputFile,
    ],
    {
      onExit(_proc, exitCode, _signalCode, error) {
        if (exitCode) {
          red(`  exitCode: ${exitCode}`)
          process.exit(1)
        }
        if (error) {
          red(`  error: ${error.message}`)
          process.exit(1)
        }
      },
    },
  )
}

export const uploadFileToS3 = async (fileToUpload: string, filename: string) => {
  if (dryRun) return 'http://example.com/does-not-exist.pmtiles'
  const accessKeyId = process.env.S3_KEY
  const secretAccessKey = process.env.S3_SECRET
  const region = process.env.S3_REGION
  const bucket = process.env.S3_BUCKET
  const folder = process.env.S3_UPLOAD_FOLDER

  const s3Client = new S3Client({
    credentials: { accessKeyId, secretAccessKey },
    region,
  })

  const fileKey = `uploads/${folder}/${filename}`
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: fs.readFileSync(fileToUpload),
      }),
    )
  } catch (e) {
    red(`  ${e.message}`)
    process.exit(1)
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`
}

const findGeojson = (folderName) => {
  const folderPath = path.join(geoJsonFolder, folderName)
  const filenames = fs.readdirSync(folderPath).filter((filename) => pp(filename).ext === '.geojson')
  if (filenames.length === 0) {
    yellow(`  Folder "${folderName}" does not contain a geojson.`)
    return null
  }
  if (filenames.length > 1) {
    yellow(`  Folder "${folderName}" contains multiple geojsons.`)
    return null
  }

  const filename = filenames[0]!
  const filePath = path.join(folderPath, filename)
  if (!fs.lstatSync(filePath).isFile()) {
    yellow(`  Folder "${folderName}/${filename}" is not a file.`)
    return null
  }

  return filename
}

const checkFilename = (filename) => {
  const m = filename.match(/[^\-.0-9a-zA-Z_]/g)
  if (m !== null) {
    const chars = JSON.stringify(m).slice(1, -1)
    yellow(
      `  Filename "${filename}" contains potentially problematic ${pluralize(
        'character',
        m.length,
      )} ${chars}.`,
    )
    return false
  }
  return true
}

const import_ = async (folderName, moduleName, valueName, warnIfModuleDoesNotExist?) => {
  const moduleFileName = `${moduleName}.ts`
  const moduleFilePath = path.join(geoJsonFolder, folderName, moduleFileName)
  if (!fs.existsSync(moduleFilePath)) {
    if (warnIfModuleDoesNotExist) {
      yellow(`  ${moduleFileName} is missing in folder ${folderName}`)
    }
    return null
  } else {
    const module_ = await import(`./geojson/${folderName}/${moduleName}`)
    if (!(valueName in module_)) {
      yellow(`  ${moduleFileName} does not export value "${valueName}".`)
      return null
    }
    return module_[valueName]
  }
}

const transformFile = async (folderName, inputFilepath) => {
  const transform = await import_(folderName, 'transform', 'transform')
  if (transform === null) {
    return inputFilepath
  }

  const outputFilepath = path.join(tmpDir, `${pp(inputFilepath).name}.transformed.geojson`)
  keepTemporaryFiles
    ? console.log(`  Transforming geojson file to "${outputFilepath}"...`)
    : console.log(`  Transforming geojson file...`)
  if (dryRun) {
    return outputFilepath
  }
  const data = await Bun.file(inputFilepath).json()
  const transformedData = transform(data)
  Bun.write(outputFilepath, JSON.stringify(transformedData, null, 2))

  return outputFilepath
}

// create tmp folder
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true })
}

if (!fs.existsSync(geoJsonFolder)) {
  red(
    `folder "${geoJsonFolder}" does not exists. Have you forgot to run "npm run link-atlas-static-data"?`,
  )
  process.exit(1)
}

const folderNames = fs.readdirSync(geoJsonFolder).sort()
for (const i in folderNames) {
  const folderName = folderNames[i]!
  const folderPath = path.join(geoJsonFolder, folderName)

  if (!fs.lstatSync(folderPath).isDirectory()) {
    // is not a folder
    continue
  }

  inverse(`Processing folder "${folderName}"...`)

  const uploadSlug = slugify(folderName.replaceAll('_', '-'))
  if (folderName !== uploadSlug) {
    yellow(
      `  Folder name "${folderName}" is not a valid slug. A valid slug could be "${uploadSlug}"`,
    )
    continue
  }

  const metaData = await import_(folderName, 'meta', 'data', true)
  if (metaData === null) {
    continue
  }

  const geojsonFullFilename = findGeojson(folderName)
  if (!geojsonFullFilename) continue

  if (!checkFilename(geojsonFullFilename)) {
    // logs info is filename is not ok
    continue
  }

  const inputFilepath = await transformFile(folderName, path.join(folderPath, geojsonFullFilename))
  const outputFilename = pp(inputFilepath).name
  const outputFilepath = path.join(tmpDir, `${outputFilename}.pmtiles`)

  keepTemporaryFiles
    ? console.log(`  Generating pmtiles file "${outputFilepath}"...`)
    : console.log(`  Generating pmtiles file...`)
  await generatePMTilesFile(inputFilepath, outputFilepath)

  console.log('  Uploading generated pmtiles file...')
  const s3filename = `${uploadSlug}/${pp(outputFilepath).base}`
  const pmtilesUrl = await uploadFileToS3(outputFilepath, s3filename)

  const regionSlugs: string[] = []
  metaData.regions.forEach((regionSlug) => {
    if (existingRegionSlugs.includes(regionSlug)) {
      regionSlugs.push(regionSlug)
    } else {
      yellow(`  region "${regionSlug}" (defined in meta.regions) does not exist.`)
    }
  })

  const info =
    regionSlugs.length === 0
      ? 'will not be assigned to any region'
      : `will be assigned to ${pluralize('region', regionSlugs.length)} ${regionSlugs.join(', ')}`
  console.log(`  Saving upload to DB (${info})...`)
  if (!dryRun) {
    await createUpload({
      uploadSlug,
      pmtilesUrl,
      regionSlugs,
      isPublic: metaData.public,
      configs: metaData.configs,
    })
  }

  green('  OK')
}

if (!keepTemporaryFiles) {
  // clean up
  fs.rmSync(tmpDir, { recursive: true, force: true })
}
