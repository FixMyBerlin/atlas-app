import invariant from 'tiny-invariant'

const apiRootUrl = process.env.API_ROOT_URL
invariant(apiRootUrl?.startsWith('http'), 'API_ROOT_URL missing.')

export const getRegionsUrl = `${apiRootUrl}/regions`
export const getUploadsUrl = `${apiRootUrl}/uploads`
export const createUploadUrl = `${apiRootUrl}/uploads/create`
export const deleteAllUploadsUrl = `${apiRootUrl}/uploads/delete-all`

const addApiKey = (url) =>
  url + '?' + new URLSearchParams({ apiKey: process.env.ATLAS_API_KEY! }).toString()

export const getRegions = async (): Promise<{ id: number; slug: string }[]> => {
  const url = addApiKey(getRegionsUrl)
  return (await (await fetch(url)).json()).map((region) => ({
    id: region.id,
    slug: region.slug,
  }))
}

type UploadData = {
  uploadSlug: string
  pmtilesUrl: string
  regionSlugs: string[]
  isPublic: boolean
  config: Record<string, any>
}
export const createUpload = async (data: UploadData) => {
  return await fetch(
    new Request(createUploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: process.env.ATLAS_API_KEY!,
        ...data,
      }),
    }),
  )
}

export const deleteAllUploads = async () => {
  return await fetch(
    new Request(deleteAllUploadsUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: process.env.ATLAS_API_KEY!,
      }),
    }),
  )
}
