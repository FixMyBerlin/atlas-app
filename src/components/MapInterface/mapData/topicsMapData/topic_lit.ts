import { MapDataTopic } from '../types'
import {
  MapboxStyleLayerGroupLitIds,
  MapboxStyleLayers_lit,
} from './mapboxStyles'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'lit'
const source = 'tarmac_lit'
const sourceLayer = 'public.lit_verified'
export type TopicLitId = typeof topic
export type TopicLitStyleIds = 'default' | MapboxStyleLayerGroupLitIds
export type TopicLitStyleFilterIds = '_nofilter'
export type TopicLitStyleLegendIds = 'lit' | 'unlit' | 'ignore'

export const topic_lit: MapDataTopic = {
  id: topic,
  name: 'Beleuchtung',
  desc: null,
  sourceId: source,
  allowVerify: true,
  styles: [
    {
      id: 'default',
      name: 'Inhalte',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_lit',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
      legends: [
        {
          id: 'lit',
          name: 'Beleuchtet',
          layers: [
            '2_lit-Beleuchtet',
            '2_lit-Special',
          ] as MapboxStyleLayers_lit[],
        },
        {
          id: 'unlit',
          name: 'Unbeleuchtet',
          layers: ['2_lit-Unbeleuchtet'] as MapboxStyleLayers_lit[],
        },
        {
          id: 'ignore',
          name: null,
          layers: ['2_hitarea-lit'] as MapboxStyleLayers_lit[],
        },
      ],
    },
    {
      id: 'atlas_lit_complete',
      name: 'Inhalte & Vollständigkeit',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_lit_complete',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
      legends: [
        {
          id: 'lit',
          name: 'Beleuchtet',
          layers: null,
          style: {
            type: 'line',
            color: 'hsl(47, 94%, 57%)',
          },
        },
        {
          id: 'unlit',
          name: 'Unbeleuchtet',
          layers: null,
          style: {
            type: 'line',
            color: 'hsl(47, 86%, 15%)',
          },
        },
        {
          id: 'missing',
          name: 'Daten fehlen',
          layers: null,
          style: {
            type: 'line',
            color: 'hsl(330, 46%, 46%)',
          },
        },
        {
          id: 'ignore',
          name: null,
          layers: ['ignore_for_now'],
        },
      ],
    },
    {
      id: 'atlas_lit_verified',
      name: 'Inhalte & Prüf-Status',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_lit_verified',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
    },
    {
      id: 'atlas_lit_fresh',
      name: 'Inhalte & Aktualität',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_lit_fresh',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
    },
  ],
}
