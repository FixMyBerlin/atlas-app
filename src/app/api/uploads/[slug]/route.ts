import db from 'db'
import { getBlitzContext } from '@blitzjs/auth'
import { proxyS3Url } from './proxyS3Url'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

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

  const url = upload!.url
  const s3baseUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`

  if (url.startsWith(s3baseUrl)) {
    return proxyS3Url(request, url)
  } else {
    return await fetch(url)
  }
}
