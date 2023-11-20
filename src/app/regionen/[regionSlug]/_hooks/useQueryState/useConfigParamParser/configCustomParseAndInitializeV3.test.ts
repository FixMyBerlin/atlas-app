import { describe, expect, test } from 'vitest'
import { MapDataThemeIds } from '../../../../../../regions/data/mapData/themesMapData/themes.const'
import { createInitialCategoriesConfig } from '../../../_components/mapStateConfig/createMapRegionConfig'
import { configCustomParseAndInitialize } from './configCustomParseAndInitialize'

describe('config param parser v2', () => {
  const themes = [
    // The order here specifies the order in the UI
    'fromTo',
    'bikelanes',
    'roadClassification',
  ] satisfies MapDataThemeIds[]
  const freshConfig = createInitialCategoriesConfig(themes)

  describe('handle legacy v2 input', () => {
    test('An empty input returns a freshConfig', () => {
      const inputV3 = ''
      const result = configCustomParseAndInitialize(inputV3, freshConfig)
      expect(result).toMatchObject(freshConfig)
    })

    test('An input with just the version string returns a freshConfig', () => {
      const inputV3 = '[v3]'
      const result = configCustomParseAndInitialize(inputV3, freshConfig)
      expect(result).toMatchObject(freshConfig)
    })
  })
})
