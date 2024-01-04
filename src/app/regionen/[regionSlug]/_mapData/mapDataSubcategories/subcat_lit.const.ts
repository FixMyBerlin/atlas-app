import { FileMapDataSubcategory } from '../types'
import { defaultLegendFresh } from './defaultLegend/defaultLegendFresh'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { legacyMapboxStyleLayers } from './mapboxStyles/legacyMapboxStyleLayers'

const subcatId = 'lit'
const source = 'atlas_roads'
const sourceLayer = 'roads'
export type SubcatLitId = typeof subcatId
export type SubcatLitStyleIds = 'default' | 'completeness' | 'verification' | 'freshness'

const defaultLegend: FileMapDataSubcategory['styles'][0]['legends'] = [
  {
    id: 'lit',
    name: 'Beleuchtet',
    style: {
      type: 'line',
      color: 'hsl(47, 94%, 57%)',
    },
  },
  {
    id: 'lit-special',
    name: 'Beleuchtet (Sonderfälle)',
    style: {
      type: 'line',
      color: 'hsl(35, 100%, 61%)',
    },
  },
  {
    id: 'unlit',
    name: 'Unbeleuchtet',
    style: {
      type: 'line',
      color: 'hsl(47, 86%, 19%)',
    },
  },
]

export const subcat_lit: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Beleuchtung',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Inhalte',
      desc: null,
      layers: legacyMapboxStyleLayers({
        group: 'atlas_lit',
        source,
        sourceLayer,
      }),
      legends: [...defaultLegend],
    },
    {
      id: 'completeness',
      name: 'Inhalte & Vollständigkeit',
      desc: null,
      layers: [
        legacyMapboxStyleLayers({
          group: 'atlas_lit_complete',
          source,
          sourceLayer,
        }),
        legacyMapboxStyleLayers({
          group: 'atlas_lit',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        ...defaultLegend,
        {
          id: 'missing',
          name: 'Daten fehlen',
          style: {
            type: 'line',
            color: 'hsl(312, 92%, 74%)',
          },
        },
      ],
    },
    {
      id: 'freshness',
      name: 'Inhalte & Aktualität',
      desc: null,
      layers: [
        legacyMapboxStyleLayers({
          group: 'atlas_lit_fresh',
          source,
          sourceLayer,
        }),
        legacyMapboxStyleLayers({
          group: 'atlas_lit',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [...defaultLegend, ...defaultLegendFresh],
    },
  ],
}
