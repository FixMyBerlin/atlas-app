import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'node:fs'
import path from 'node:path'
import { red } from '../utils/log'

/** @returns URL of pmtile on S3 */
export const uploadFileToS3 = async (uploadFullFilename: string, datasetFolder: string) => {
  console.log('  Uploading generated pmtiles file to S3...')

  const accessKeyId = process.env.S3_KEY
  const secretAccessKey = process.env.S3_SECRET
  const region = process.env.S3_REGION
  const bucket = process.env.S3_BUCKET
  const folder = process.env.S3_UPLOAD_FOLDER

  const s3Client = new S3Client({
    credentials: { accessKeyId, secretAccessKey },
    region,
  })

  const remoteFilename = `${datasetFolder}/${path.parse(uploadFullFilename).base}`
  const fileKey = `uploads/${folder}/${remoteFilename}`
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: fs.readFileSync(uploadFullFilename),
      }),
    )
  } catch (e) {
    red(`  ${e.message}`)
    process.exit(1)
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`
}
