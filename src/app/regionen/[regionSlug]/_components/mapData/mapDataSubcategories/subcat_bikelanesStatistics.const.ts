import { MapDataSubcat } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { debugLayerStyles } from './mapboxStyles/debugLayerStyles'

const subcatId = 'bikelanesStatistics'
const source = 'atlas_boundaryStats'
const sourceLayer = 'public.boundaryStats'
export type SubcatBikelanesStatsId = typeof subcatId
export type SubcatBikelanesStatsStyleIds =
  | 'default'
  | 'admin-level-6'
  | 'admin-level-7'
  | 'admin-level-8'

// Docs https://wiki.openstreetmap.org/wiki/DE:Grenze#Innerstaatliche_Grenzen
export const subcat_bikelanesStatistics: MapDataSubcat = {
  id: subcatId,
  name: 'Statistik',
  sourceId: source,
  beforeId: undefined,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default', // admin-level-4
      name: 'Bundesländer & Stadtstaaten',
      desc: null,
      layers: debugLayerStyles({
        source,
        sourceLayer,
        filter: ['match', ['get', 'admin_level'], ['4'], true, false],
      }),
    },
    {
      id: 'admin-level-6',
      name: 'Landkreise / Kreise',
      desc: null,
      layers: debugLayerStyles({
        source,
        sourceLayer,
        filter: ['match', ['get', 'admin_level'], ['6'], true, false],
      }),
    },
    {
      id: 'admin-level-7',
      name: 'Ämter (u.ä.)',
      desc: null,
      layers: debugLayerStyles({
        source,
        sourceLayer,
        filter: ['match', ['get', 'admin_level'], ['7'], true, false],
      }),
    },
    {
      id: 'admin-level-8',
      name: 'Gemeinden (u.ä.)',
      desc: null,
      layers: debugLayerStyles({
        source,
        sourceLayer,
        filter: ['match', ['get', 'admin_level'], ['8'], true, false],
      }),
    },
  ],
}
