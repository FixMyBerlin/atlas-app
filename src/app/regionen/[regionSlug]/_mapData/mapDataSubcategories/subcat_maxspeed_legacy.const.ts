import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'

const subcatId = 'maxspeed_legacy'
const source = 'atlas_maxspeed'
const sourceLayer = 'maxspeed'
export type SubcatMaxspeedIdLegacy = typeof subcatId
export type SubcatMaxspeedStyleIdsLegacy = 'default' | 'details' | 'source'

export const subcat_maxspeed_legacy: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Höchstgeschwindigkeit (OLD)',
  ui: 'dropdown',
  sourceId: source,
  styles: [
    defaultStyleHidden,
    {
      id: 'default',
      name: 'Hohe Geschwindigkeiten (Legacy)',
      desc: '', // todo
      layers: legacyMapboxStyleLayers({
        group: 'atlas_old_roadclass_maxspeed',
        source,
        sourceLayer,
      }),
    },
    {
      id: 'details',
      name: 'Details (Legacy)',
      desc: '', // todo
      layers: legacyMapboxStyleLayers({
        group: 'atlas_old_roadclass_maxspeed_details',
        source,
        sourceLayer,
      }),
    },
  ],
}
