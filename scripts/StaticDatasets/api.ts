import invariant from 'tiny-invariant'

const apiRootUrl = process.env.API_ROOT_URL
invariant(apiRootUrl?.startsWith('http'), 'API_ROOT_URL missing.')

export const getRegionsUrl = `${apiRootUrl}/regions`
export const getUploadsUrl = `${apiRootUrl}/uploads`
export const createUploadUrl = `${apiRootUrl}/uploads/create`

const addApiKey = (url) =>
  url + '?' + new URLSearchParams({ apiKey: process.env.EXPORT_ACCESS_TOKEN! }).toString()

export const getSlugs = async (url: string): Promise<string[]> => {
  url = addApiKey(url)
  return (await (await fetch(url)).json()).map((region) => region.slug)
}

export const getRegions = async (): Promise<{ id: number; slug: string }[]> => {
  const url = addApiKey(getRegionsUrl)
  return (await (await fetch(url)).json()).map((region) => ({
    id: region.id,
    slug: region.slug,
  }))
}

export const createUpload = async ({
  uploadSlug,
  pmtilesUrl,
  layersUrl,
  regionSlugs,
  isPublic,
}) => {
  return await fetch(
    new Request(createUploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: process.env.EXPORT_ACCESS_TOKEN!,
        uploadSlug,
        pmtilesUrl,
        layersUrl,
        regionSlugs,
        isPublic,
      }),
    }),
  )
}
