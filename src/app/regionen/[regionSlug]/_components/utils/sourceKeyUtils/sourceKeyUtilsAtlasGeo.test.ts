import { describe, expect, test } from 'vitest'
import {
  createSourceKeyAtlasGeo,
  extractSourceIdIdFromAtlasGeoSourceKey,
  extractSubcatIdFromAtlasGeoSourceKey,
} from './sourceKeyUtilsAtlasGeo'

describe('extractSourceIdIdFromAtlasGeoSourceKey()', () => {
  test('work when used with the right input', () => {
    const input = createSourceKeyAtlasGeo('fooCategory', 'fooSource', 'fooSubcategory')
    const result = extractSourceIdIdFromAtlasGeoSourceKey(input)
    expect(result).toMatch('fooSource')
  })
})

describe('extractSubcatIdFromAtlasGeoSourceKey()', () => {
  test('work when used with the right input', () => {
    const input = createSourceKeyAtlasGeo('fooCategory', 'fooSource', 'fooSubcategory')
    const result = extractSubcatIdFromAtlasGeoSourceKey(input)
    expect(result).toMatch('fooSubcategory')
  })
})
