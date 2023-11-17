'use client'

import { additionalRegionAttributes } from 'src/regions/components/additionalRegionAttributes.const'
import invariant from 'tiny-invariant'
import { useRegionSlug } from './useRegionSlug'

export const useStaticRegion = () => {
  const regionSlug = useRegionSlug()
  const region = additionalRegionAttributes.find((addData) => addData.slug === regionSlug)
  invariant(region, `Region ${regionSlug} not found in useStaticRegionData`)
  return region
}
