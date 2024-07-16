'use client'

import { staticRegion } from 'src/app/regionen/(index)/_data/regions.const'
import { useRegionSlug } from './useRegionSlug'

export const useStaticRegion = () => {
  const regionSlug = useRegionSlug()
  return staticRegion.find((addData) => addData.slug === regionSlug)
}
