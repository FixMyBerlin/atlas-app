import { describe, expect, test } from 'vitest'
import {
  testFilterConfig,
  testFilterData,
} from './mergeFilterDataWithConfig.test'
import { specifyFilters } from './specifyFilters'

// Source src/components/MapInterface/mapData/topicsMapDataConfig/utils/tarmac-style.const.json
const testLayerFilterSimple = ['match', ['get', 'Foo'], ['true'], true, false]
const testLayerFilterSimple2 = [
  'match',
  ['get', 'Bar'],
  ['good', 'intermediate', 'bad', 'excellent'],
  true,
  false,
]
const testLayerFilterWithAll = [
  'all',
  testLayerFilterSimple,
  testLayerFilterSimple2,
]

describe('specifyFilters()', () => {
  describe('layer filter BUT no data filter', () => {
    test('No layerFilter either', () => {
      const filter = specifyFilters(undefined, undefined, undefined)
      expect(filter).toMatchObject(['all'])
    })

    test('With simple layer filter', () => {
      const filter = specifyFilters(testLayerFilterSimple, undefined, undefined)
      expect(filter).toMatchObject(['all', testLayerFilterSimple])
    })

    test('With "all" layer filter', () => {
      const filter = specifyFilters(
        testLayerFilterWithAll,
        undefined,
        undefined
      )
      expect(filter).toMatchObject(testLayerFilterWithAll)
    })
  })

  describe('layer filter AND data filter', () => {
    test('layer filter is simple (no "all")', () => {
      const filter = specifyFilters(
        testLayerFilterSimple,
        testFilterData,
        testFilterConfig
      )
      expect(filter[0]).toBe('all')
      expect(filter[1]).toEqual(testLayerFilterSimple)
      expect(filter[2].flat().includes('Unfallort')).toBeTruthy
      expect(filter[3].flat().includes('UJAHR')).toBeTruthy
    })

    test('layer filter has "all"', () => {
      const filter = specifyFilters(
        testLayerFilterWithAll,
        testFilterData,
        testFilterConfig
      )
      expect(filter[0]).toEqual('all')
      expect(filter[1]).toEqual(testLayerFilterSimple)
      expect(filter[2]).toEqual(testLayerFilterSimple2)
      expect(filter[3].flat().includes('Unfallort')).toBeTruthy
      expect(filter[4].flat().includes('UJAHR')).toBeTruthy
    })
  })
})
