import { useParams } from 'next/navigation'

export const useRegionSlug = () => {
  const regionSlug = useParams()?.regionSlug

  if (Array.isArray(regionSlug)) {
    return regionSlug[0]
  }

  return regionSlug
}
