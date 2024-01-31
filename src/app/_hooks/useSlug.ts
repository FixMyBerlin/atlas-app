import { useParams } from 'next/navigation'

export const useSlug = () => {
  const slug = useParams()?.slug
  return Array.isArray(slug) ? slug[0] : slug
}
