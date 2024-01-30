// We use bun.sh to run this file
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import slugify from 'slugify'

import { getSlugs, getUploadsUrl, createUpload, getRegions } from './api'
import { green, yellow, inverse, red } from './log'
import { generatePMTilesFile } from './utils/generatePMTilesFile'
import invariant from 'tiny-invariant'

const geoJsonFolder = 'scripts/StaticDatasets/geojson'
const tmpDir = path.join(os.tmpdir(), 'pmtiles')
const regions = await getRegions()
const existingRegionSlugs = regions.map((region) => region.slug)
const existingUploadSlugs = await getSlugs(getUploadsUrl)

const uploadFileToS3 = async (fileToUpload: string, filename: string) => {
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

// create tmp folder
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true })
}

const files = fs.readdirSync(geoJsonFolder).filter((f) => f.endsWith('.geojson'))
for (const i in files) {
  const file = files[i]!
  inverse(`Processing file "${file}"...`)

  const uploadSlug = slugify(path.parse(file).name).toLowerCase()

  const isUpdateRun = existingUploadSlugs.includes(uploadSlug)
  if (isUpdateRun) {
    yellow(`  Replacing existing "${uploadSlug}" (but skipping DB part)`)
  }

  const inputFile = path.join(geoJsonFolder, file)
  const outputFile = path.join(tmpDir, `${uploadSlug}.pmtiles`)

  console.log('  Generating pmtiles file...', outputFile)
  await generatePMTilesFile(inputFile, outputFile)

  console.log('  Uploading generated file...')
  const uploadUrl = await uploadFileToS3(outputFile, `${uploadSlug}.pmtiles`)

  if (!isUpdateRun) {
    const regionSlugs = file
      .split('-')
      .filter((regionSlug) => existingRegionSlugs.includes(regionSlug))

    // maps slug to id
    const regionSlugToId = Object.fromEntries(regions.map((region) => [region.slug, region.id]))
    const regionIds = regionSlugs.map((regionsSlug) => regionSlugToId[regionsSlug])
    const isPublic = path.parse(file).name.endsWith('-public')

    console.log(`  Saving upload to DB (will be assigned to regions ${regionSlugs.join(', ')})...`)
    const response = await createUpload(uploadSlug, uploadUrl, regionIds, isPublic)
    if (response.status !== 201) {
      red(JSON.stringify(await response.json(), null, 2))
      process.exit(1)
    }
  }

  green('  OK')
}

// clean up
fs.rmSync(tmpDir, { recursive: true, force: true })
