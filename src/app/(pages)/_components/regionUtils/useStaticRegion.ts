'use client'

import { staticRegions } from 'src/regions/data/regions.const'
import invariant from 'tiny-invariant'
import { useRegionSlug } from './useRegionSlug'

export const useStaticRegion = () => {
  const regionSlug = useRegionSlug()
  const region = staticRegions.find((addData) => addData.slug === regionSlug)
  invariant(region, `Region ${regionSlug} not found in useStaticRegionData`)
  return region
}
