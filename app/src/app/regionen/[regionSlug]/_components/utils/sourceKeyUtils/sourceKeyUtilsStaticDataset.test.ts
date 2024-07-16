import { describe, expect, test } from 'vitest'
import {
  createSourceKeyStaticDatasets,
  extractSourceIdFromStaticDatasetSourceKey,
} from './sourceKeyUtilsStaticDataset'

describe('extractSourceIdFromStaticDatasetSourceKey()', () => {
  test('works with a simple source', () => {
    const input = createSourceKeyStaticDatasets('fooSource', undefined)
    const result = extractSourceIdFromStaticDatasetSourceKey(input)
    expect(result).toMatch('fooSource')
  })

  test('works with a simple source', () => {
    const input = createSourceKeyStaticDatasets('fooSource', 'fooSubId')
    const result = extractSourceIdFromStaticDatasetSourceKey(input)
    expect(result).toMatch('fooSource')
  })
})
