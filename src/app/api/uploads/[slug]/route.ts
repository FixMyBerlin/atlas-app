import db from 'db'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { GetObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/GetObjectCommand'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  const upload = await db.upload.findFirst({ where: { slug } })
  if (upload === null) {
    return Response.json({ statusText: 'Not Found' }, { status: 404 })
  }

  const { hostname, pathname } = new URL(upload!.externalUrl)
  const accessKeyId = process.env.S3_PMTILES_KEY!
  const secretAccessKey = process.env.S3_PMTILES_SECRET!
  const region = process.env.S3_PMTILES_REGION!

  const s3Client = new S3Client({
    credentials: { accessKeyId, secretAccessKey },
    region,
  })

  const sendParams: GetObjectCommandInput = {
    Bucket: hostname.split('.')[0]!,
    Key: pathname.substring(1),
  }
  const range = request.headers.get('range')
  if (range !== null) sendParams.Range = range!

  // TODO: add error handling
  const response = await s3Client.send(new GetObjectCommand(sendParams))

  return new Response(response.Body!, {
    // @ts-expect-error this exists
    status: response.Body.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Length': response.ContentLength!,
      'Content-Type': response.ContentType!,
      ETag: response.ETag!,
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      Expires: 0,
    },
  })
}
