'use client'

import { useQuery } from '@blitzjs/rpc'
import getPublicRegion from 'src/regions/queries/getPublicRegion'
import invariant from 'tiny-invariant'
import { useRegionSlug } from './useRegionSlug'

export const useRegion = () => {
  const regionSlug = useRegionSlug()
  // const region = additionalRegionAttributes.find((r) => r.slug === regionSlug)
  const [region] = useQuery(getPublicRegion, { slug: regionSlug })
  invariant(region, `Region ${regionSlug} not found in useStaticRegionData`)
  return region
}
