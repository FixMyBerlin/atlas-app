import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'places'
export type SubcatPlacesId = typeof subcatId
export type SubcatPlacesStyleIds = 'default' | 'circle'

export const subcat_places: MapDataSubcat = {
  id: subcatId,
  name: 'Orte',
  sourceId: 'atlas_places',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Ortsnamen',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_places',
        source: 'atlas_places',
        sourceLayer: 'public.places',
      }),
      legends: null,
    },
    {
      id: 'circle',
      name: 'Ortsname & Einwohner',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_placescircle',
        source: 'atlas_places',
        sourceLayer: 'public.places',
      }),
      legends: null,
    },
  ],
}
