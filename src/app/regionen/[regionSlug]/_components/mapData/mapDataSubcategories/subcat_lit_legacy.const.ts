import { MapDataSubcat } from '../types'
import { defaultLegendFresh } from './defaultLegend/defaultLegendFresh'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'lit_legacy'
const source = 'atlas_lit'
const sourceLayer = 'public.lit'
export type SubcatLitIdLegacy = typeof subcatId
export type SubcatLitStyleIdsLegacy = 'default' | 'completeness' | 'verification' | 'freshness'

const defaultLegend: MapDataSubcat['styles'][0]['legends'] = [
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

export const subcat_lit_legacy: MapDataSubcat = {
  id: subcatId,
  name: 'Beleuchtung (OLD)',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Inhalte',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_old_lit',
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
        mapboxStyleLayers({
          group: 'atlas_lit_complete', // only roads
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'atlas_old_lit',
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
        mapboxStyleLayers({
          group: 'atlas_old_lit_fresh',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'atlas_old_lit',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [...defaultLegend, ...defaultLegendFresh],
    },
  ],
}
