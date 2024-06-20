import { GetObjectCommand, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3'
import { GetObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/GetObjectCommand'

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

  // @ts-expect-error this was working before and after some updates this causes type issues
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
