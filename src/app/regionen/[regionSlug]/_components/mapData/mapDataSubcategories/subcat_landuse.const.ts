import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'landuse'
export type SubcatLanduseId = typeof subcatId
export type SubcatLanduseStyleIds = 'default'

export const subcat_landuse: MapDataSubcat = {
  id: subcatId,
  name: 'Wohn- und Gewerbegebiete',
  desc: null,
  sourceId: 'atlas_landuse',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_landuse',
        source: 'atlas_landuse',
        sourceLayer: 'public.landuse',
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
