import { calcConfigChecksum } from '../../lib'
import { staticRegion } from '../../../../../../../(index)/_data/regions.const'
import { createFreshCategoriesConfig } from '../../../createFreshCategoriesConfig'

export function generateChecksums() {
  return Object.fromEntries(
    staticRegion.map((region) => {
      const freshConfig = createFreshCategoriesConfig(region.categories)
      const checksum = calcConfigChecksum(freshConfig)
      return [region.slug, checksum]
    }),
  )
}
