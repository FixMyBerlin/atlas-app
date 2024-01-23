import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import getUpload from 'src/uploads/queries/getUpload'
import { getSession } from '@blitzjs/auth'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { GetObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/GetObjectCommand'

const Schema = z.object({
  slug: z.string(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != 'GET') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const _slug = req.query.slug!
  const upload = await getUpload(
    { slug: Array.isArray(_slug) ? _slug[0]! : _slug },
    // @ts-ignore will work
    { session: await getSession(req, res) },
  )
  if (!upload) {
    res.status(404).send('Not Found')
    return
  }

  const { hostname, pathname } = new URL(upload.externalUrl)
  const accessKeyId = process.env.S3_PMTILES_KEY!
  const secretAccessKey = process.env.S3_PMTILES_SECRET!
  const region = process.env.S3_PMTILES_REGION!

  const s3Client = new S3Client({
    credentials: { accessKeyId, secretAccessKey },
    region,
  })

  const params: GetObjectCommandInput = {
    Bucket: hostname.split('.')[0],
    Key: pathname.substring(1),
  }
  const range = req.headers.range
  if (range) params.Range = range

  const response = await s3Client.send(new GetObjectCommand(params))

  res.setHeader('Content-Length', response.ContentLength!)
  res.setHeader('Content-Type', response.ContentType!)
  res.setHeader('ETag', response.ETag!)
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Expires', 0)
  // @ts-expect-error this exists
  res.status(response.Body.statusCode)

  const stream = response.Body!
  await new Promise(async (resolve) => {
    // @ts-ignore
    stream.pipe(res)
    // @ts-ignore
    stream.on('end', resolve)
  })
}
