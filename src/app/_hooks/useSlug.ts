import { useParams } from 'next/navigation'

export default () => {
  const slug = useParams()?.slug
  return Array.isArray(slug) ? slug[0] : slug
}
