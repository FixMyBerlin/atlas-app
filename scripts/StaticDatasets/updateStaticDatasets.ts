// We use bun.sh to run this file
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import slugify from 'slugify'

import { getSlugs, getUploadsUrl, createUpload, getRegions } from './api'
import { green, yellow, inverse, red } from './log'
import { generatePMTilesFile } from './utils/generatePMTilesFile'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const geoJsonFolder = 'scripts/StaticDatasets/geojson'
const tmpDir = path.join(os.tmpdir(), 'pmtiles')
const regions = await getRegions()
const existingRegionSlugs = regions.map((region) => region.slug)
const existingUploadSlugs = await getSlugs(getUploadsUrl)

export const uploadFileToS3 = async (fileToUpload: string, filename: string) => {
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

const loadMeta = (folderName) => {
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

const folderNames = fs.readdirSync(geoJsonFolder)
for (const i in folderNames) {
  const folderName = folderNames[i]!
  const folderPath = path.join(geoJsonFolder, folderName)

  if (!fs.lstatSync(folderPath).isDirectory()) {
    // is not a folder
    continue
  }

  inverse(`Processing folder "${folderName}"...`)

  if (folderName !== slugify(folderName)) {
    yellow(`  Folder name "${folderName}" is not a valid slug.`)
    continue
  }

  const meta = loadMeta(folderName)

  const geojsonFilename = findGeojson(folderName)
  if (!geojsonFilename) continue

  const uploadSlug = folderName
  const inputFile = path.join(folderPath, geojsonFilename)
  const outputFile = path.join(tmpDir, 'output.pmtiles')

  console.log(`  Generating pmtiles file...`)
  await generatePMTilesFile(inputFile, outputFile)

  console.log('  Uploading generated pmtiles file...')
  const s3filename = `${uploadSlug}/${geojsonFilename.split('.')[0]!}.pmtiles`
  const uploadUrl = await uploadFileToS3(outputFile, s3filename)

  const regionSlugs: string[] = []
  meta.regions.forEach((regionSlug) => {
    if (existingRegionSlugs.includes(regionSlug)) {
      regionSlugs.push(regionSlug)
    } else {
      yellow(`  region "${regionSlug}" (defined in meta.regions) does not exist.`)
    }
  })

  console.log(`  Saving upload to DB (will be assigned to regions ${meta.regions.join(', ')})...`)
  const response = await createUpload(uploadSlug, uploadUrl, regionSlugs, meta.public)
  if (response.status !== 201) {
    red(JSON.stringify(await response.json(), null, 2))
    process.exit(1)
  }

  green('  OK')
}

// clean up
fs.rmSync(tmpDir, { recursive: true, force: true })
