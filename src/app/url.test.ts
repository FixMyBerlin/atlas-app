import { describe, expect, test } from 'vitest'
import { sources } from './regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { numericSourceIds } from './url'

describe('Test data required for url decoding', () => {
  test('For every sourceId a numeric id defined by numericSourceIds is defined', () => {
    const requiredSourceIds = Object.values(numericSourceIds)
    sources.forEach((source) => {
      expect(requiredSourceIds).toContain(source.id)
    })
  })
})
