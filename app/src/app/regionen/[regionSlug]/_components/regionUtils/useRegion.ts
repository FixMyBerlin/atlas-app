'use client'
import getRegion from '@/src/regions/queries/getRegion'
import { useQuery } from '@blitzjs/rpc'
import invariant from 'tiny-invariant'
import { useRegionSlug } from './useRegionSlug'

export const useRegion = () => {
  const regionSlug = useRegionSlug()
  const [region] = useQuery(getRegion, { slug: regionSlug })
  invariant(region, `Region ${regionSlug} not found in useStaticRegionData`)
  return region
}
