'use client'

import { SourceDatasets } from './sourcesDatasets.const'
import { sourceDatasetIdUrl } from './utils/sourceDatasetIdUrl'

export const sourcesDatasetsWoldegk: SourceDatasets = [
  {
    regionKey: ['woldegk'],
    ...sourceDatasetIdUrl('woldegk-radnetz-vorschlaege'),
    name: 'Radnetz Vorschläge August 2023',
    type: 'vector',
    attributionHtml: '',
    inspector: { enabled: false },
    layers: [
      {
        id: 'vorschlage',
        type: 'line',
        paint: {
          'line-color': ['get', 'felt:color'],
          'line-opacity': 0.5,
          'line-width': 5,
          'line-dasharray': [
            'step',
            ['zoom'],
            ['literal', [1, 0]],
            10,
            ['literal', [2, 1]],
            15,
            ['literal', [3, 2]],
          ],
        },
      },
    ],
  },
]
