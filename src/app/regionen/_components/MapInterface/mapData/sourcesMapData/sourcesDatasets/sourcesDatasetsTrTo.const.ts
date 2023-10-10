'use client'

import { SourceDatasets } from './sourcesDatasets.const'
import { sourceDatasetIdUrl } from './utils/sourceDatasetIdUrl'

export const sourcesDatasetsTrTo: SourceDatasets = [
  {
    regionKey: ['trto'],
    ...sourceDatasetIdUrl('TrtoWunschlinienCrossingPoints'),
    name: 'Wunschlinien: Zwangspunkte',
    type: 'vector',
    attributionHtml: 'FixMyCity',
    inspector: { enabled: false },
    layers: [
      {
        id: 'zwangspunkte',
        type: 'circle',
        paint: {
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
          'circle-color': '#3f74de',
          'circle-radius': 4,
          'circle-stroke-color': '#3f74de',
        },
      },
    ],
  },
  {
    regionKey: ['trto'],
    ...sourceDatasetIdUrl('TrtoWunschlinienLocationPoints'),
    name: 'Wunschlinien: Zielpunkte',
    type: 'vector',
    attributionHtml: 'FixMyCity',
    inspector: { enabled: false },
    layers: [
      {
        id: 'zielpunkte',
        type: 'circle',
        paint: {
          'circle-radius': ['match', ['get', 'Siedlung'], [1], 8, 4],
          'circle-opacity': 0.1,
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
          'circle-stroke-color': '#3f74de',
          'circle-color': '#3f74de',
        },
      },
    ],
  },
  {
    regionKey: ['trto'],
    ...sourceDatasetIdUrl('TrtoWunschlinienConnectionLines'),
    name: 'Wunschlinien',
    type: 'vector',
    attributionHtml: 'FixMyCity',
    inspector: { enabled: false },
    layers: [
      {
        id: 'wunschlininien',
        type: 'line',
        paint: {
          'line-color': '#3f74de',
          'line-opacity': 0.63,
          'line-width': 2,
        },
      },
    ],
  },
  {
    regionKey: ['trto'],
    ...sourceDatasetIdUrl('TrtoRadnetz'),
    name: 'Radnetz',
    type: 'vector',
    attributionHtml: 'Amt Altentreptow',
    inspector: { enabled: false },
    layers: [
      {
        id: 'trtoradnetz',
        type: 'line',
        paint: {
          'line-color': '#c026d3',
          'line-opacity': 0.3,
          'line-width': 4,
        },
      },
      // TODO: Figure out why those labels do not show up.
      //       OR… make those Dataset layers interactive optionally.
      // {
      //   id: 'trtoradnetz_label',
      //   type: 'symbol',
      //   layout: {
      //     'text-allow-overlap': true,
      //     'text-ignore-placement': true,
      //     'text-size': ['interpolate', ['linear'], ['zoom'], 14.99, 0, 15, 9, 20, 20],
      //     'text-field': 'foo', //['to-string', ['get', 'Wegeklasse_TrTo']],
      //   },
      //   paint: {
      //     'text-color': 'rgb(60, 60, 60)',
      //     'text-halo-width': ['interpolate', ['linear'], ['zoom'], 15, 1, 18, 2.5],
      //     'text-halo-color': 'rgb(255, 255, 255)',
      //     'icon-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0, 14, 0, 15, 1],
      //   },
      // },
    ],
  },
]
