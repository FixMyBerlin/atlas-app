import { describe, expect, test } from 'vitest'
import { MapDataCategoryIds } from '../../../../../../regions/data/map/categoryData.const'
import { createInitialCategoriesConfig } from '../../../_components/mapStateConfig/createMapRegionConfig'
import {
  configCustomParseV3,
  configCustomStringifyV3,
  isV3String,
  removeVersionStringFromArray,
} from './configCustomParserV3'

describe('config param parser v3', () => {
  const categories = [
    // The order here specifies the order in the UI
    'poi',
    'bikelanes',
    'roads',
  ] satisfies MapDataCategoryIds[]
  const freshConfig = createInitialCategoriesConfig(categories)

  describe('handle version string', () => {
    test('configCustomStringifyV3 appends a version string', () => {
      const result = configCustomStringifyV3({})
      expect(result.endsWith('v3')).toBeTruthy
    })
    test('configCustomParseV3 holds version string', () => {
      const result = configCustomParseV3('foo/v3')
      expect(result.version).toBe('v3')
    })
    test('isV3String detects the version', () => {
      const result = isV3String('foo/v3')
      expect(result).toBeTruthy
    })
    test('removeVersionStringFromArray removes the version', () => {
      const result = removeVersionStringFromArray(['foo', 'v3'])
      expect(result).toMatchObject(['foo'])
    })
  })

  describe('configCustomStringifyV3', () => {
    test('handle empty', () => {
      const result = configCustomStringifyV3({})
      expect(result.endsWith('v3')).toBeTruthy
    })
    test('handle full example', () => {
      const categoriesSubcategoriesPlusStyle = {
        poi: { poi: 'default' },
        bikelanes: {
          bikelanes: 'details',
          trafficSigns: 'default',
        },
      }
      const result = configCustomStringifyV3(categoriesSubcategoriesPlusStyle)
      expect(result).toBe('poi/poi~default|bikelanes/bikelanes~details/trafficSigns~default|v3')
    })
  })

  describe('configCustomParseV3', () => {
    test('handle empty', () => {
      const result = configCustomParseV3('')
      expect(result.urlObject).toMatchObject({})
    })
    test('handle full example', () => {
      const result = configCustomParseV3(
        'poi/poi~default|bikelanes/bikelanes~details/trafficSigns~default|v3',
      )
      expect(result.urlObject).toMatchObject({
        urlObject: {
          poi: { poi: 'default' },
          bikelanes: {
            bikelanes: 'details',
            trafficSigns: 'default',
          },
        },
        version: 'v3',
      })
    })
  })
})
