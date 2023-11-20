import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'maxspeed_legacy'
const source = 'atlas_maxspeed'
const sourceLayer = 'public.maxspeed'
export type SubcatMaxspeedIdLegacy = typeof subcatId
export type SubcatMaxspeedStyleIdsLegacy = 'default' | 'details' | 'source'

export const subcat_maxspeed_legacy: MapDataSubcat = {
  id: subcatId,
  name: 'Höchstgeschwindigkeit (OLD)',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Hohe Geschwindigkeiten',
      desc: '', // todo
      layers: mapboxStyleLayers({ group: 'atlas_old_roadclass_maxspeed', source, sourceLayer }),
    },
    {
      id: 'details',
      name: 'Details',
      desc: '', // todo
      layers: mapboxStyleLayers({
        group: 'atlas_old_roadclass_maxspeed_details',
        source,
        sourceLayer,
      }),
    },
  ],
}
