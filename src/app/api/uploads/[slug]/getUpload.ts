import db from 'db'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { GetObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/GetObjectCommand'
import { getBlitzContext } from '@blitzjs/auth'

export async function getUpload(request, slug, fieldname: 'pmtilesUrl' | 'layersUrl') {
  const upload = await db.upload.findFirst({
    where: { slug },
    include: { regions: { select: { id: true } } },
  })
  if (upload === null) {
    return Response.json({ statusText: 'Not Found' }, { status: 404 })
  }

  if (!upload.public) {
    const forbidden = Response.json({ statusText: 'Forbidden' }, { status: 403 })
    const session = (await getBlitzContext()).session
    if (!session.userId) {
      return forbidden
    }
    if (session.role !== 'ADMIN') {
      // user must be a member in one or more regions the upload is related to
      const regionIds = upload!.regions.map((region) => region.id)
      const membershipExists = !!(await db.membership.count({
        where: { userId: session.userId!, region: { id: { in: regionIds } } },
      }))
      if (!membershipExists) {
        return forbidden
      }
    }
  }

  const url = upload[fieldname]
  if (url === null) {
    return Response.json({ statusText: `${fieldname} Is Null` }, { status: 404 })
  }

  const { hostname, pathname } = new URL(url)
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
