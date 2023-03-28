import { MapDataTopic } from '../types'
import { defaultLegendFresh } from './defaultLegend'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'lit'
const source = 'tarmac_lit'
const sourceLayer = 'public.lit_verified'
export type TopicLitId = typeof topic
export type TopicLitStyleIds = 'default' | 'completeness' | 'verification' | 'freshness'
export type TopicLitStyleFilterIds = '_nofilter'
export type TopicLitStyleLegendIds = 'lit' | 'unlit' | 'ignore'

const defaultLegend: MapDataTopic['styles'][0]['legends'] = [
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

export const topic_lit: MapDataTopic = {
  id: topic,
  name: 'Beleuchtung',
  desc: null,
  sourceId: source,
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
      legends: [...defaultLegend],
    },
    {
      id: 'completeness',
      name: 'Inhalte & Vollständigkeit',
      desc: null,
      layers: [
        mapboxStyleLayers({
          group: 'atlas_lit_complete',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'atlas_lit',
          source,
          sourceLayer,
        }),
      ].flat(),
      interactiveFilters: null,
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
      id: 'verification',
      name: 'Inhalte & Prüf-Status',
      desc: null,
      layers: [
        mapboxStyleLayers({
          group: 'atlas_lit_verified',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'atlas_lit',
          source,
          sourceLayer,
        }),
      ].flat(),
      interactiveFilters: null,
      legends: [
        ...defaultLegend,
        // {
        //   id: 'spacer',
        // },
        {
          id: 'verification-missing',
          name: 'Daten richtig',
          style: {
            type: 'line',
            color: 'hsl(107, 88%, 57%)',
          },
        },
        {
          id: 'verification-rejected',
          name: 'Daten überarbeiten',
          style: {
            type: 'line',
            color: 'hsl(0, 100%, 41%)',
          },
        },
        {
          id: 'verification-accepted',
          name: 'Überprüfung steht aus',
          style: {
            type: 'line',
            color: '#fa7fe2',
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
          group: 'atlas_lit_fresh',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'atlas_lit',
          source,
          sourceLayer,
        }),
      ].flat(),
      interactiveFilters: null,
      legends: [...defaultLegend, ...defaultLegendFresh],
    },
  ],
}
