import { useParams } from 'next/navigation'

export const useRegionSlug = () => {
  let regionSlug = useParams()?.regionSlug
  if (Array.isArray(regionSlug)) regionSlug = regionSlug[0]
  return regionSlug
}
