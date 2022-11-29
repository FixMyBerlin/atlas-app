import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'bikelanescenterline'
export type TopicBikelanescenterlineId = typeof topic
export type TopicBikelanescenterlineStyleIds =
  | 'default'
  | 'original'
  | 'atlas_bikelanes_complete'
  | 'atlas_bikelanes_fresh'
export type TopicBikelanescenterlineStyleFilterIds = '_nofilter'

const defaultLegend: MapDataTopic['styles'][0]['legends'] = [
  {
    id: 'separated',
    name: 'Getrennte Fuehrung',
    style: {
      type: 'line',
      color: '#031ab5',
    },
  },
  {
    id: 'shared',
    name: 'Fuehrung mit Fussverkehr',
    style: {
      type: 'line',
      color: 'hsl(232, 97%, 36%)',
      dasharray: [7, 3],
    },
  },
  {
    id: 'pedestrian',
    name: 'Verkehrsberuhigt',
    style: {
      type: 'line',
      color: 'hsla(232, 99%, 39%, 0.34)',
      dasharray: [7, 3],
    },
  },
]

export const topic_bikelanescenterline: MapDataTopic = {
  id: topic,
  name: 'Fahrradinfrastruktur Centerline',
  desc: '',
  sourceId: 'tarmac_bikelanescenterline',
  allowVerify: false,
  styles: [
    {
      id: 'default',
      name: 'Inhalte (Mod)',
      desc: null,
      layers: [
        {
          id: 'Fuehrung mit Fussverkehr copy 3',
          type: 'line',
          source: 'tarmac_bikelanescenterline',
          'source-layer': 'public.bikelanesCenterlineNew',
          paint: {
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 13, 2],
            'line-dasharray': [2, 1],
            'line-offset': 2,
            'line-color': 'purple',
          },
          filter: [
            'match',
            ['get', 'category'],
            ['footway_bicycleYes', 'footAndCycleway_shared'],
            true,
            false,
          ],
          layout: {},
        },
        {
          id: 'Getrennte Fuehrung copy 3',
          type: 'line',
          source: 'tarmac_bikelanescenterline',
          'source-layer': 'public.bikelanesCenterlineNew',
          paint: {
            'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 13, 2],
            'line-color': 'purple',
            'line-offset': 2,
          },
          filter: [
            'match',
            ['get', 'category'],
            [
              'cyclewaySeparated',
              'cyclewayAlone',
              'footAndCycleway_segregated',
            ],
            true,
            false,
          ],
          layout: {},
        },
      ],
      interactiveFilters: null,
      legends: [
        {
          id: 'separated',
          name: 'Getrennte Fuehrung',
          style: {
            type: 'line',
            color: 'purple',
          },
        },
        {
          id: 'shared',
          name: 'Fuehrung mit Fussverkehr',
          style: {
            type: 'line',
            color: 'purple',
            dasharray: [7, 3],
          },
        },
        {
          id: 'pedestrian',
          name: 'Verkehrsberuhigt',
          style: {
            type: 'line',
            color: 'purple',
            dasharray: [7, 3],
          },
        },
      ],
    },
    {
      id: 'original',
      name: 'Inhalte (Original)',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes',
        source: 'tarmac_bikelanes',
        sourceLayer: 'public.bikelanes_verified',
      }),
      interactiveFilters: null,
      legends: [...defaultLegend],
    },
    {
      id: 'atlas_bikelanes_complete',
      name: 'Inhalte & Vollständigkeit',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes_complete',
        source: 'tarmac_bikelanescenterline',
        sourceLayer: 'public.bikelanesCenterlineNew',
      }),
      interactiveFilters: null,
      legends: [
        ...defaultLegend,
        {
          id: 'missing',
          name: 'Daten fehlen (in Arbeit)',
          style: {
            type: 'line',
            color: 'hsl(312, 92%, 74%)',
          },
        },
      ],
    },
    {
      id: 'atlas_bikelanes_fresh',
      name: 'Inhalte & Aktualität',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes_fresh',
        source: 'tarmac_bikelanescenterline',
        sourceLayer: 'public.bikelanesCenterlineNew',
      }),
      interactiveFilters: null,
      legends: [
        ...defaultLegend,
        {
          id: 'fresh_check_date',
          name: 'TODO: Aktuell (explizit)',
          style: {
            type: 'line',
            color: 'hsl(107, 88%, 57%)',
          },
        },
        {
          id: 'fresh_update_at',
          name: 'TODO: Aktuell (implizit)',
          style: {
            type: 'line',
            color: 'hsl(107, 88%, 57%)',
            dasharray: [7, 3],
          },
        },
        {
          id: 'outdated_check_date',
          name: 'TODO: Veraltet (explizit)',
          style: {
            type: 'line',
            color: 'hsl(0, 100%, 41%)',
          },
        },
        {
          id: 'outdated_update_at',
          name: 'TODO: Veraltet (implizit)',
          style: {
            type: 'line',
            color: 'hsl(0, 100%, 41%)',
            dasharray: [7, 3],
          },
        },
      ],
    },
  ],
}
