// We use bun.sh to run this file
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import slugify from 'slugify'
import { parseArgs } from 'util'

import { getSlugs, getUploadsUrl, createUpload, getRegions } from './api'
import { green, yellow, inverse, red } from './log'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const geoJsonFolder = 'scripts/StaticDatasets/geojson'
const tmpDir = path.join(os.tmpdir(), 'pmtiles')
const regions = await getRegions()
const existingRegionSlugs = regions.map((region) => region.slug)
const existingUploadSlugs = await getSlugs(getUploadsUrl)

// script can be run with --dry-run to just run all checks
// without processing geojsons, uploading pmtiles and saving to db
const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: { 'dry-run': { type: 'boolean' } },
  strict: true,
  allowPositionals: true,
})

const dryRun = !!values['dry-run']

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
  const accessKeyId = process.env.S3_PMTILES_KEY
  const secretAccessKey = process.env.S3_PMTILES_SECRET
  const region = process.env.S3_PMTILES_REGION
  const bucket = process.env.S3_PMTILES_BUCKET
  const folder = process.env.S3_PMTILES_FOLDER

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
  const filenames = fs
    .readdirSync(folderPath)
    .filter((filename) => path.parse(filename).ext === '.geojson')
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

const loadMetaData = (folderName) => {
  const filePath = path.join(geoJsonFolder, folderName, 'meta.ts')
  if (!fs.existsSync(filePath)) {
    yellow(`  File meta.ts is missing in folder ${folderName}`)
    return null
  } else {
    const meta = require(`./geojson/${folderName}/meta`)
    if (!('data' in meta)) {
      yellow(`  meta.ts does not export data.`)
      return null
    }
    return meta.data
  }
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

const folderNames = fs.readdirSync(geoJsonFolder)
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

  const metaData = loadMetaData(folderName)
  if (metaData === null) {
    continue
  }

  if (JSON.stringify(metaData.regions) !== JSON.stringify(metaData.config.regionKey)) {
    yellow('  metaData.regions !== metaData.config.regionKey')
  }

  const geojsonFilename = findGeojson(folderName)
  if (!geojsonFilename) continue

  const inputFile = path.join(folderPath, geojsonFilename)
  const outputFile = path.join(tmpDir, 'output.pmtiles')

  console.log(`  Generating pmtiles file...`)
  await generatePMTilesFile(inputFile, outputFile)

  console.log('  Uploading generated pmtiles file...')
  const s3filename = `${uploadSlug}/${geojsonFilename.split('.')[0]!}.pmtiles`
  const pmtilesUrl = await uploadFileToS3(outputFile, s3filename)

  const regionSlugs: string[] = []
  metaData.regions.forEach((regionSlug) => {
    if (existingRegionSlugs.includes(regionSlug)) {
      regionSlugs.push(regionSlug)
    } else {
      yellow(`  region "${regionSlug}" (defined in meta.regions) does not exist.`)
    }
  })

  console.log(
    `  Saving upload to DB (will be assigned to region(s) ${metaData.regions.join(', ')})...`,
  )
  if (!dryRun) {
    const response = await createUpload({
      uploadSlug,
      pmtilesUrl,
      regionSlugs,
      isPublic: metaData.public,
      config: metaData.config,
    })
    if (response.status !== 201) {
      red(JSON.stringify(await response.json(), null, 2))
      process.exit(1)
    }
  }

  green('  OK')
}

// clean up
fs.rmSync(tmpDir, { recursive: true, force: true })
