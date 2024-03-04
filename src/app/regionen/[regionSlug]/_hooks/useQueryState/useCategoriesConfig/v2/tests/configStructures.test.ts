import { describe, expect, test } from 'vitest'
import { staticRegion } from 'src/app/regionen/(index)/_data/regions.const'
import { createFreshCategoriesConfig } from '../../createFreshCategoriesConfig'
import { configStructures } from '../configStructures'
import { generateConfigStructureAndChecksum } from '../lib'

describe('Check config structures', () => {
  test('all config structures exist', () => {
    staticRegion.forEach((region) => {
      const { slug, categories } = region
      const config = createFreshCategoriesConfig(categories)
      const [_, checksum] = generateConfigStructureAndChecksum(config)
      expect(configStructures).toHaveProperty(checksum)
    })
  })
})
