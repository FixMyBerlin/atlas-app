import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_atlas_ziele_plus_landuse } from './mapboxStyles/groups/atlas_ziele_plus_landuse'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

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
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_ziele_plus_landuse,
        source: 'atlas_landuse',
        sourceLayer: 'landuse',
      }),
      legends: [
        {
          id: 'residential',
          name: 'Wohngegend',
          style: { type: 'fill', color: '#fdd4c4' },
        },
        {
          id: 'non-residential',
          name: 'Gewerbe',
          style: { type: 'fill', color: '#cec0fb' },
        },
      ],
    },
  ],
}
