export const sourceStaticDatasetIdUrl = (staticDatasetSlug: string) => {
  const url = `${process.env.NEXT_PUBLIC_APP_ORIGIN}/api/uploads/${staticDatasetSlug}`
  return { id: staticDatasetSlug, url: `pmtiles://${url}` }
}
