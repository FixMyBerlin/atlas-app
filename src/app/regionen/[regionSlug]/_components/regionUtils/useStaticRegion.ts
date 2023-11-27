'use client'

import { additionalRegionAttributes } from 'src/regions/components/additionalRegionAttributes.const'
import { useRegionSlug } from './useRegionSlug'

export const useStaticRegion = () => {
  const regionSlug = useRegionSlug()
  return additionalRegionAttributes.find((addData) => addData.slug === regionSlug)
}
