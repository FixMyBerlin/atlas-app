import { SourceDatasets } from './sourcesDatasets.const'
import { defaultLineLayerStyles, defaultPointLayerStyles } from './utils/defaultLayerStyles'
import { sourceLegacyDatasetIdUrl } from './utils/sourceDatasetIdUrl'

export const sourcesDatasetsNudafa: SourceDatasets = [
  {
    regionKey: ['nudafa'],
    ...sourceLegacyDatasetIdUrl('nudafa-combined'),
    name: 'Zielnetz Stand 22.11.2023',
    subId: 'zielnetz',
    type: 'vector',
    attributionHtml: '',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: defaultLineLayerStyles({
      filter: ['match', ['get', 'Typ'], ['Zielnetz'], true, false],
    }),
  },
  {
    regionKey: ['nudafa'],
    ...sourceLegacyDatasetIdUrl('nudafa-combined'),
    name: 'Wichtige Ziele aus Beteiligung',
    subId: 'destination',
    type: 'vector',
    attributionHtml: '',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: defaultPointLayerStyles({
      filter: ['match', ['get', 'Typ'], ['Destination'], true, false],
    }),
  },
  {
    regionKey: ['nudafa'],
    ...sourceLegacyDatasetIdUrl('nudafa-combined'),
    name: 'Luftlinien',
    subId: 'wundschlinie',
    type: 'vector',
    attributionHtml: '',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: defaultLineLayerStyles({
      filter: ['match', ['get', 'Typ'], ['Wundschlinie'], true, false],
    }),
  },
  {
    regionKey: ['nudafa'],
    ...sourceLegacyDatasetIdUrl('nudafa-combined'),
    name: 'Maßnahmen',
    subId: 'project',
    type: 'vector',
    attributionHtml: '',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      ...defaultLineLayerStyles({
        filter: ['match', ['get', 'Typ'], ['Maßnahme Linie'], true, false],
      }),
      ...defaultPointLayerStyles({
        filter: ['match', ['get', 'Typ'], ['Maßnahme Punkt'], true, false],
      }),
    ],
  },
  {
    regionKey: ['nudafa'],
    ...sourceLegacyDatasetIdUrl('nudafa-combined'),
    name: 'Ergänzungsvorschlag Route',
    subId: 'addroutes',
    type: 'vector',
    attributionHtml: '',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: defaultLineLayerStyles({
      filter: ['match', ['get', 'Typ'], ['Vorschlag Route'], true, false],
    }),
  },
  {
    regionKey: ['nudafa'],
    ...sourceLegacyDatasetIdUrl('nudafa-combined'),
    name: 'Problem Strecke',
    subId: 'issues',
    type: 'vector',
    attributionHtml: '',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: defaultLineLayerStyles({
      filter: ['match', ['get', 'Typ'], ['Problem Strecke'], true, false],
    }),
  },
]
