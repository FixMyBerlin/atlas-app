import { describe, expect, test } from 'vitest'
import { filterArrayFromMergedDataAndConfig } from './filterArrayFromMergedDataAndConfig'
import { mergeFilterDataWithConfigState } from './mergeFilterDataWithConfigState'
import {
  testFilterConfig,
  testFilterData,
} from './mergeFilterDataWithConfigState.test'

describe('filterArrayFromMergedDataAndConfig()', () => {
  test('No layerFilter either', () => {
    const filterDataAndConfig = mergeFilterDataWithConfigState(
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
