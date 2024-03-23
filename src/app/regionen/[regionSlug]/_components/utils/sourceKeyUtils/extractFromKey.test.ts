import { describe, expect, test } from 'vitest'
import { createSourceKeyAtlasGeo } from './sourceKeyUtilsAtlasGeo'
import { extractSubcatIdFromAtlasGeoSourceKey } from './sourceKeyUtilsAtlasGeo'

describe('extractSubcatIdFromSourceKey()', () => {
  test('work when used with the right input', () => {
    const input = createSourceKeyAtlasGeo('fooCategory', 'fooSource', 'fooSubcategory')
    const result = extractSubcatIdFromAtlasGeoSourceKey(input)
    expect(result).toMatch('fooSubcategory')
  })
})
