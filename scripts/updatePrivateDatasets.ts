// We use bun.sh to run this file
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { getSlugs, getUploadsUrl, createUpload, getRegions } from './api'
import { green, yellow, inverse, red } from './log'

const geoJsonFolder = 'private-datasets/geojson'
const tmpDir = path.join(os.tmpdir(), 'pmtiles')
const regions = await getRegions()
const existingRegionSlugs = regions.map((region) => region.slug)
const existingUploadSlugs = await getSlugs(getUploadsUrl)

const generatePMTilesFile = (inputFile, outputFile) => {
  Bun.spawnSync(['tippecanoe', `--output=${outputFile}`, '--force', '--layer=default', inputFile], {
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
  })
}

const uploadFileToS3 = async (fileToUpload, filename) => {
  const accessKeyId = process.env.S3_PMTILES_KEY!
  const secretAccessKey = process.env.S3_PMTILES_SECRET!
  const region = process.env.S3_PMTILES_REGION!
  const bucket = process.env.S3_PMTILES_BUCKET!
  const folder = process.env.S3_PMTILES_FOLDER!

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

// create tmp folder
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true })
}

const files = fs.readdirSync(geoJsonFolder).filter((f) => f.endsWith('.geojson'))
for (const i in files) {
  const file = files[i]!
  inverse(`Processing file "${file}"...`)

  const uploadSlug = path.parse(file).name
  const regionSlug = uploadSlug.split('-')[0]!

  if (existingUploadSlugs.includes(uploadSlug)) {
    yellow(`  Upload "${uploadSlug}" already exists.`)
    continue
  }

  const inputFile = path.join(geoJsonFolder, file)
  const outputFile = path.join(tmpDir, `${uploadSlug}.pmtiles`)

  console.log('  Generating pmtiles file...', outputFile)
  await generatePMTilesFile(inputFile, outputFile)

  console.log('  Uploading generated file...')
  const uploadUrl = await uploadFileToS3(outputFile, `${uploadSlug}.pmtiles`)

  let regionsInfo = ''
  const regionSlugs = file
    .split('-')
    .filter((regionSlug) => existingRegionSlugs.includes(regionSlug))
  if (regionSlugs.length === 1) {
    regionsInfo = ` (will be assigned to region ${regionSlugs[0]})`
  } else if (regionSlugs.length > 1) {
    regionsInfo = ` (will be assigned to regions ${regionSlugs.join(', ')})`
  }
  // maps slug to id
  const regionSlugToId = Object.fromEntries(regions.map((region) => [region.slug, region.id]))
  const regionIds = regionSlugs.map((regionsSlug) => regionSlugToId[regionsSlug])
  const isPublic = path.parse(file).name.endsWith('-public')

  console.log(`  Saving upload to DB${regionsInfo}...`)
  const response = await createUpload(uploadSlug, uploadUrl, regionIds, isPublic)
  if (response.status !== 201) {
    red(JSON.stringify(await response.json(), null, 2))
    process.exit(1)
  }

  green('  OK')
}

// clean up
fs.rmSync(tmpDir, { recursive: true, force: true })
