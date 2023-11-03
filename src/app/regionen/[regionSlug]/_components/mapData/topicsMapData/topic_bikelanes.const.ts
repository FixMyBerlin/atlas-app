import { verifiedColor } from 'src/app/regionen/[regionSlug]/_components/Inspector/Verification/verifiedColor.const'
import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topicId = 'bikelanes'
const source = 'tarmac_bikelanes'
const sourceLayer = 'public.bikelanes_verified'
export type TopicBikelanesId = typeof topicId
export type TopicBikelanesStyleIds =
  | 'default'
  | 'verification'
  | 'completeness'
  | 'freshness'
  | 'bikelane_oneway_arrows'

export const defaultLegend: NonNullable<MapDataTopic['styles'][0]['legends']> = [
  {
    id: 'separated',
    name: 'Getrennte Fuehrung',
    desc: [
      'Radweg (frei geführt und Fahrbahnbegleitend)',
      'Getrennter Geh- und Radweg',
      'Fahrradstraße',
      'Straßenquerung',
      'Verbindungsstücke',
    ],
    style: {
      type: 'line',
      color: '#031ab5',
    },
  },
  {
    id: 'shared',
    name: 'Teilgetrennte Führung',
    desc: [
      'Gemeinsamer Geh- und Radwege',
      'Radfahrstreifen',
      'Schutzstreifen',
      'Gemeinsamer Fahrstreifen mit Bus',
    ],
    style: {
      type: 'line',
      color: 'hsl(232, 97%, 36%)',
      dasharray: [7, 3],
    },
  },
  {
    id: 'mixed',
    name: 'Mischverkehr',
    desc: [
      'Fußgängerzone mit Radfreigabe',
      'Spielstraße',
      'Fußwege mit Radfreigabe',
      'Gemeinsamer Fahrstreifen mit Kfz',
      'Fahrradweichen',
    ],
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
  id: topicId,
  name: 'Radinfrastruktur',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: 'tarmac_bikelanes',
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Inhalte',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_bikelanes',
        source,
        sourceLayer,
      }),
      legends: [...defaultLegend],
    },
    {
      id: 'verification',
      name: 'Inhalte & Prüf-Status',
      desc: null,
      layers: [
        mapboxStyleLayers({
          group: 'atlas_bikelanes_verified',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'atlas_bikelanes',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        ...defaultLegend,
        {
          id: 'verification-approved',
          name: 'Daten richtig',
          style: {
            type: 'line',
            color: verifiedColor['approved'],
          },
        },
        {
          id: 'verification-rejected',
          name: 'Daten überarbeiten',
          style: {
            type: 'line',
            color: verifiedColor['rejected'],
          },
        },
        {
          id: 'verification-todo',
          name: 'Überprüfung steht aus',
          style: {
            type: 'line',
            color: verifiedColor['undefined'],
          },
        },
      ],
    },
    {
      id: 'completeness',
      name: 'Aufgabe: Führungsform',
      desc: 'Hervorhebung ',
      layers: [
        mapboxStyleLayers({
          group: 'atlas_bikelanes_unspecified',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'atlas_bikelanes',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'unspecified',
          name: 'Angabe ob Führungs&shy;form straßen&shy;begleitend oder frei geführt unklar',
          style: {
            type: 'line',
            color: '#fa7fe2',
          },
        },
        ...defaultLegend,
      ],
    },
    {
      id: 'bikelane_oneway_arrows',
      name: 'DEBUG: Einbahnstraßen Pfeile',
      desc: '',
      layers: [
        {
          id: 'oneway-bikelanes',
          source,
          'source-layer': sourceLayer,
          type: 'line',
          paint: {
            'line-width': 15,
            'line-pattern': 'oneway',
            'line-color': 'gray',
          },
          filter: ['has', '_parent_highway'],
        },
      ],
      legends: undefined,
    },
    // {
    //   id: 'freshness',
    //   name: 'Inhalte & Aktualität',
    //   desc: null,
    //   layers: mapboxStyleLayers({
    //     group: 'atlas_bikelanes_fresh',
    //     source,
    //     sourceLayer,
    //   }),
    //       //   legends: [
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
