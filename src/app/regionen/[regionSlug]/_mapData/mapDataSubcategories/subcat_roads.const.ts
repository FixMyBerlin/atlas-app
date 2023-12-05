import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'roads'
const source = 'atlas_roads'
const sourceLayer = 'roads'
export type SubcatRoadsId = typeof subcatId
export type SubcatRoadsStyleIds = 'default' | 'sidestreets'
export const subcat_roads: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Straßentypen',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: 'Straßenklassifieriung auf Basis von OpenStreetMap Straßentypen.',
      layers: mapboxStyleLayers({
        group: 'atlas_roadclassification_all',
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'main',
          name: 'Hauptstraßen',
          style: { type: 'line', color: '#F6E7AC', width: 8 },
        },
        {
          id: 'side-high',
          name: 'Nebenstraßen vorr. hohe Kfz-Dichte',
          style: { type: 'line', color: '#E4B407', width: 5 },
        },
        {
          id: 'side-low',
          name: 'Nebenstraßen vorr. niedrige Kfz-Dichte',
          style: { type: 'line', color: '#E4B407', width: 2 },
        },
        {
          id: 'residential',
          name: 'Wohnstraßen',
          style: { type: 'line', color: '#A2C9F6', width: 2 },
        },
        {
          id: 'low-traffic',
          name: 'Verkehrsberuhigt',
          style: { type: 'line', color: '#447BE9', width: 2 },
        },
      ],
    },
    {
      id: 'sidestreets',
      name: 'Nur Nebenstraßen',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_roadclassification_sidestreets',
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'side--side-high',
          name: 'Nebenstraßen vorr. hohe Kfz-Dichte',
          style: { type: 'line', color: '#E4B407', width: 5 },
        },
        {
          id: 'side--side-low',
          name: 'Nebenstraßen vorr. niedrige Kfz-Dichte',
          style: { type: 'line', color: '#E4B407', width: 2 },
        },
        {
          id: 'side--residential',
          name: 'Wohnstraßen',
          style: { type: 'line', color: '#A2C9F6', width: 2 },
        },
        {
          id: 'side--low-traffic',
          name: 'Verkehrsberuhigt',
          style: { type: 'line', color: '#447BE9', width: 2 },
        },
      ],
    },
  ],
}
