import { SourceDatasets } from './sourcesDatasets.const'
import { sourceDatasetIdUrl } from './utils/sourceDatasetIdUrl'

export const sourcesDatasetsBB: SourceDatasets = [
  {
    regionKey: ['bb'],
    ...sourceDatasetIdUrl('bb-radnetz-barnim'),
    name: 'Radnetz Landkreis Barnim',
    type: 'vector',
    attributionHtml: '&copy; TODO',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bb-radnetz-barnim',
        type: 'line',
        paint: {
          'line-color': '#4f46e5',
          'line-opacity': 0.6,
          'line-width': 4,
        },
      },
    ],
  },
  {
    regionKey: ['bb'],
    ...sourceDatasetIdUrl('bb-ramboll-zentrale-orte'),
    name: '(Ramboll) Zentrale Orte',
    type: 'vector',
    attributionHtml: '&copy; OpenStreetMap, Ramboll',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bb-zentrale-orte',
        type: 'circle',
        paint: {
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
          'circle-color': '#4d7c0f',
          'circle-radius': 4,
          'circle-stroke-color': '#4d7c0f',
        },
      },
    ],
  },
]
