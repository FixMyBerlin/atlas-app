'use client'

import { useParams } from 'next/navigation'
import invariant from 'tiny-invariant'

export const useRegionSlug = () => {
  const params = useParams()
  const slug = String(params?.regionSlug) || undefined
  invariant(slug)
  return slug
}
