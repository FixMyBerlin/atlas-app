import { MapDataTopic } from '../types'
import { MapboxStyleLayerGroupBikelanesIds } from './mapboxStyles'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'bikelanes'
export type TopicBikelanesId = typeof topic
export type TopicBikelanesStyleIds =
  | 'default'
  | MapboxStyleLayerGroupBikelanesIds
export type TopicBikelanesStyleFilterIds = '_nofilter'

export const defaultLegend: NonNullable<MapDataTopic['styles'][0]['legends']> =
  [
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
    {
      id: 'needsClarification',
      name: '(Führungsform unklar)',
      style: {
        type: 'line',
        color: 'hsl(317, 97%, 36%)',
        dasharray: [7, 3],
      },
    },
  ]

export const topic_bikelanes: MapDataTopic = {
  id: topic,
  name: 'Radinfrastruktur',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: 'tarmac_bikelanes',
  styles: [
    {
      id: 'default',
      name: 'Inhalte',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes',
        source: 'tarmac_bikelanes',
        sourceLayer: 'public.bikelanes_verified',
      }),
      interactiveFilters: null,
      legends: [...defaultLegend],
    },
    // {
    //   id: 'atlas_bikelanes_complete',
    //   name: 'Inhalte & Vollständigkeit',
    //   desc: null,
    //   layers: mapboxStyleLayers({
    //     group: 'atlas_bikelanes_complete',
    //     source: 'tarmac_bikelanes',
    //     sourceLayer: 'public.bikelanes_verified',
    //   }),
    //   interactiveFilters: null,
    //   legends: [
    //     ...defaultLegend,
    //     {
    //       id: 'missing',
    //       name: 'Daten fehlen (in Arbeit)',
    //       style: {
    //         type: 'line',
    //         color: 'hsl(312, 92%, 74%)',
    //       },
    //     },
    //   ],
    // },
    {
      id: 'atlas_bikelanes_verified',
      name: 'Inhalte & Prüf-Status',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes_verified',
        source: 'tarmac_bikelanes',
        sourceLayer: 'public.bikelanes_verified',
      }),
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
    // {
    //   id: 'atlas_bikelanes_fresh',
    //   name: 'Inhalte & Aktualität',
    //   desc: null,
    //   layers: mapboxStyleLayers({
    //     group: 'atlas_bikelanes_fresh',
    //     source: 'tarmac_bikelanes',
    //     sourceLayer: 'public.bikelanes_verified',
    //   }),
    //   interactiveFilters: null,
    //   legends: [
    //     ...defaultLegend,
    //     {
    //       id: 'fresh_check_date',
    //       name: 'TODO: Aktuell (explizit)',
    //       style: {
    //         type: 'line',
    //         color: 'hsl(107, 88%, 57%)',
    //       },
    //     },
    //     {
    //       id: 'fresh_update_at',
    //       name: 'TODO: Aktuell (implizit)',
    //       style: {
    //         type: 'line',
    //         color: 'hsl(107, 88%, 57%)',
    //         dasharray: [7, 3],
    //       },
    //     },
    //     {
    //       id: 'outdated_check_date',
    //       name: 'TODO: Veraltet (explizit)',
    //       style: {
    //         type: 'line',
    //         color: 'hsl(0, 100%, 41%)',
    //       },
    //     },
    //     {
    //       id: 'outdated_update_at',
    //       name: 'TODO: Veraltet (implizit)',
    //       style: {
    //         type: 'line',
    //         color: 'hsl(0, 100%, 41%)',
    //         dasharray: [7, 3],
    //       },
    //     },
    //   ],
    // },
  ],
}
