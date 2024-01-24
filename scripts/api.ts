const apiRootUrl = 'http://127.0.0.1:5173/api'
export const getRegionsUrl = `${apiRootUrl}/regions`
export const getUploadsUrl = `${apiRootUrl}/uploads`
export const createUploadUrl = `${apiRootUrl}/uploads/create`

export const getSlugs = async (url: string): Promise<string[]> => {
  url += '?' + new URLSearchParams({ apiKey: process.env.EXPORT_ACCESS_TOKEN! }).toString()
  return (await (await fetch(url)).json()).map((region) => region.slug)
}

export const createUpload = async (uploadSlug, externalUrl, regionSlug ) => {
  return await fetch(
    new Request(createUploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: process.env.EXPORT_ACCESS_TOKEN!,
        uploadSlug,
        externalUrl,
        regionSlug,
      }),
    }),
  )
}
