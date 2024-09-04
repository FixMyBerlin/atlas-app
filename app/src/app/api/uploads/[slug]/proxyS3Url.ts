import { GetObjectCommand, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3'
import { GetObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/GetObjectCommand'
import pako from 'pako'

export async function proxyS3Url(request: Request, url: string) {
  const { hostname, pathname } = new URL(url)
  const accessKeyId = process.env.S3_KEY!
  const secretAccessKey = process.env.S3_SECRET!
  const region = process.env.S3_REGION!

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

  let response: GetObjectCommandOutput
  try {
    response = await s3Client.send(new GetObjectCommand(sendParams))
  } catch (e) {
    const { $metadata, message } = e
    return Response.json(
      { source: 'S3', statusText: message },
      { status: $metadata.httpStatusCode },
    )
  }

  let Body: any = null
  // @ts-ignore
  const statusCode = response.Body.statusCode
  let { ContentLength, ContentType, ContentEncoding, ETag } = response
  if (url.endsWith('.geojson')) {
    ContentType = 'application/geo+json'
    if (request.headers.get('accept-encoding')?.includes('gzip')) {
      const jsonString = await response.Body!.transformToString()
      const compressedArray = new Uint8Array(pako.gzip(jsonString))
      Body = compressedArray
      ContentLength = compressedArray.length
      ContentEncoding = 'gzip'
    }
  }

  return new Response(Body || response.Body, {
    status: statusCode,
    // @ts-ignore
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Length': ContentLength,
      'Content-Type': ContentType,
      'Content-Encoding': ContentEncoding,
      ETag,
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      Expires: '0',
    },
  })
}
