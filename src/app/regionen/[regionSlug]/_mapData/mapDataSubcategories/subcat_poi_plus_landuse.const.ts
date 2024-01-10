import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'

const subcatId = 'poiPlusLanduse'
export type SubcatPoiPlusLanduseId = typeof subcatId
export type SubcatPoiPlusLanduseStyleIds = 'default'

export const subcat_poi_plus_landuse: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Wohn- und Gewerbegebiete',
  sourceId: 'atlas_landuse',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard (Legacy)',
      desc: null,
      layers: legacyMapboxStyleLayers({
        group: 'atlas_landuse',
        source: 'atlas_landuse',
        sourceLayer: 'landuse',
      }),
      legends: [
        {
          id: 'residential',
          name: 'Wohngegend',
          style: { type: 'fill', color: 'hsl(17, 94%, 81%)' },
        },
        {
          id: 'non-residential',
          name: 'Gewerbe',
          style: { type: 'fill', color: 'hsl(215, 88%, 78%)' },
        },
      ],
    },
  ],
}
