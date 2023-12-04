import { describe, expect, test } from 'vitest'
import { createMapRegionConfig } from '../createMapRegionConfig'
import { flattenSubcategories } from './flattenSubcategories'
import { uniqueArray } from 'src/app/_components/utils/uniqueArray'

describe('flattenSubcategories()', () => {
  test('Flatten removes duplicate subcategories', () => {
    const initialMapConfig = createMapRegionConfig(['bikelanes', 'surface'])

    // console.log('intialConfig', JSON.stringify(initialMapConfig, undefined, 2))
    const check = uniqueArray(
      initialMapConfig[0]!.subcategories.map((t) => t.id),
      initialMapConfig[1]!.subcategories.map((t) => t.id),
    ).length

    const result = flattenSubcategories(initialMapConfig)

    // console.log('result', JSON.stringify(result, undefined, 2))
    expect(result.length).toBe(check)
  })
})
