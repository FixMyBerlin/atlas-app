import { getUpload } from './getUpload'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params
  return getUpload(request, slug, 'pmtilesUrl')
}
