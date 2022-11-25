import { describe, expect, test } from 'vitest'
import { filterArrayFromMergedDataAndConfig } from './filterArrayFromMergedDataAndConfig'
import { mergeFilterDataWithConfig } from './mergeFilterDataWithConfig'
import {
  testFilterConfig,
  testFilterData,
} from './mergeFilterDataWithConfig.test'

describe('filterArrayFromMergedDataAndConfig()', () => {
  test('No layerFilter either', () => {
    const filterDataAndConfig = mergeFilterDataWithConfig(
      testFilterData,
      testFilterConfig
    )
    const filter = filterArrayFromMergedDataAndConfig(filterDataAndConfig[0])
    expect(filter).toMatchObject([
      'match',
      ['get', 'Unfallort'],
      ['Knotenpunkt'],
      true,
      false,
    ])
    const filter2 = filterArrayFromMergedDataAndConfig(filterDataAndConfig[1])
    expect(filter2).toMatchObject([
      'match',
      ['get', 'UJAHR'],
      ['2017', '2018'],
      true,
      false,
    ])
  })
})
