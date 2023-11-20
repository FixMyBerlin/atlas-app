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
    const inputV2 =
      '!(i~fromTo~a~~topics~!(i~shops~s~!(i~hidden~a~_F)(i~default~a))(i~education~s~!(i~hidden~a)(i~default~a~_F))(i~places~s~!(i~hidden~a~_F)(i~default~a)(i~circle~a~_F))(i~buildings~s~!(i~hidden~a)(i~default~a~_F))(i~landuse~s~!(i~hidden~a~_F)(i~default~a))(i~barriers~s~!(i~hidden~a~_F)(i~default~a))(i~boundaries~s~!(i~hidden~a)(i~default~a~_F)(i~level-8~a~_F)(i~level-9-10~a~_F)))(i~bikelanes~a~~topics~!(i~bikelanes~s~!(i~hidden~a~_F)(i~default~a)(i~verification~a~_F)(i~completeness~a~_F)(i~bikelane*_oneway*_arrows~a~_F))(i~bikelanesPresence*_legacy~s~!(i~hidden~a)(i~default~a~_F))(i~places~s~!(i~hidden~a~_F)(i~default~a)(i~circle~a~_F))(i~landuse~s~!(i~hidden~a)(i~default~a~_F)))(i~roadClassification~a~_F~topics~!(i~roadClassification*_legacy~s~!(i~hidden~a~_F)(i~default~a)(i~oneway~a~_F))(i~bikelanes~s~!(i~hidden~a)(i~default~a~_F)(i~verification~a~_F)(i~completeness~a~_F)(i~bikelane*_oneway*_arrows~a~_F))(i~maxspeed*_legacy~s~!(i~hidden~a)(i~default~a~_F)(i~details~a~_F))(i~surfaceQuality*_legacy~s~!(i~hidden~a)(i~default~a~_F)(i~bad~a~_F)(i~completeness~a~_F)(i~freshness~a~_F))(i~places~s~!(i~hidden~a~_F)(i~default~a)(i~circle~a~_F))(i~landuse~s~!(i~hidden~a)(i~default~a~_F)))(i~lit~a~_F~topics~!(i~lit*_legacy~s~!(i~hidden~a~_F)(i~default~a)(i~completeness~a~_F)(i~freshness~a~_F))(i~places~s~!(i~hidden~a)(i~default~a~_F)(i~circle~a~_F))(i~landuse~s~!(i~hidden~a)(i~default~a~_F)))(i~parking~a~_F~topics~!(i~parking~s~!(i~hidden~a~_F)(i~default~a)(i~presence~a~_F)(i~surface~a~_F))(i~parkingPoints~s~!(i~hidden~a)(i~default~a~_F))(i~parkingAreas~s~!(i~hidden~a~_F)(i~default~a)(i~street*_side~a~_F))(i~parkingDebug~s~!(i~hidden~a)(i~default~a~_F))(i~parkingStats~s~!(i~hidden~a)(i~stats-admin-level-4~a~_F)(i~default~a~_F)(i~stats-admin-level-10~a~_F)(i~length-admin-level-4~a~_F)(i~length-admin-level-9~a~_F)(i~length-admin-level-10~a~_F))(i~landuse~s~!(i~hidden~a)(i~default~a~_F)))~'

    const resultObject = JSON.parse(
      `[{"id":"fromTo","active":true,"topics":[{"id":"shops","styles":[{"id":"hidden","active":false},{"id":"default","active":true}]},{"id":"education","styles":[{"id":"hidden","active":true},{"id":"default","active":false}]},{"id":"places","styles":[{"id":"hidden","active":false},{"id":"default","active":true},{"id":"circle","active":false}]},{"id":"buildings","styles":[{"id":"hidden","active":true},{"id":"default","active":false}]},{"id":"landuse","styles":[{"id":"hidden","active":false},{"id":"default","active":true}]},{"id":"barriers","styles":[{"id":"hidden","active":false},{"id":"default","active":true}]},{"id":"boundaries","styles":[{"id":"hidden","active":true},{"id":"default","active":false},{"id":"level-8","active":false},{"id":"level-9-10","active":false}]}]},{"id":"bikelanes","active":true,"topics":[{"id":"bikelanes","styles":[{"id":"hidden","active":false},{"id":"default","active":true},{"id":"verification","active":false},{"id":"completeness","active":false},{"id":"bikelane_oneway_arrows","active":false}]},{"id":"bikelanesPresence_legacy","styles":[{"id":"hidden","active":true},{"id":"default","active":false}]},{"id":"trafficSigns","styles":[{"id":"hidden","active":true},{"id":"default","active":false}]},{"id":"places","styles":[{"id":"hidden","active":false},{"id":"default","active":true},{"id":"circle","active":false}]},{"id":"landuse","styles":[{"id":"hidden","active":true},{"id":"default","active":false}]}]},{"id":"roadClassification","active":false,"topics":[{"id":"roadClassification_legacy","styles":[{"id":"hidden","active":false},{"id":"default","active":true},{"id":"oneway","active":false}]},{"id":"bikelanes","styles":[{"id":"hidden","active":true},{"id":"default","active":false},{"id":"verification","active":false},{"id":"completeness","active":false},{"id":"bikelane_oneway_arrows","active":false}]},{"id":"maxspeed_legacy","styles":[{"id":"hidden","active":true},{"id":"default","active":false},{"id":"details","active":false}]},{"id":"surfaceQuality_legacy","styles":[{"id":"hidden","active":true},{"id":"default","active":false},{"id":"bad","active":false},{"id":"completeness","active":false},{"id":"freshness","active":false}]},{"id":"trafficSigns","styles":[{"id":"hidden","active":true},{"id":"default","active":false}]},{"id":"places","styles":[{"id":"hidden","active":false},{"id":"default","active":true},{"id":"circle","active":false}]},{"id":"landuse","styles":[{"id":"hidden","active":true},{"id":"default","active":false}]}]}]`,
    ) as any[]

    test('A v2 input returns a initialized config', () => {
      const result = configCustomParseAndInitialize(inputV2, freshConfig)
      expect(result).toMatchObject(resultObject)
    })
  })
})
