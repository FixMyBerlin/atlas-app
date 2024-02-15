export const getStaticDatasetUrl = (staticDatasetSlug: string) => {
  return `${process.env.NEXT_PUBLIC_APP_ORIGIN}/api/uploads/${staticDatasetSlug}`
}
