import { SourceDatasets } from './sourcesDatasets.const'
import { sourceLegacyDatasetIdUrl } from './utils/sourceDatasetIdUrl'

export const sourcesDatasetsBiBi: SourceDatasets = [
  {
    regionKey: ['bibi'],
    ...sourceLegacyDatasetIdUrl('bibi-rad-punktdaten'),
    name: 'Radschulwegplan Verschiedene Punktdaten',
    type: 'vector',
    attributionHtml: '&copy; Amt für Stadtentwicklung und Baurecht, 17.10.2019',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bibi-rad-punktdaten',
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
  {
    regionKey: ['bibi'],
    ...sourceLegacyDatasetIdUrl('bibi-abstellplaetze-merged'),
    name: 'Radschulwegplan Radabstellplätze',
    type: 'vector',
    attributionHtml: '&copy; Amt für Stadtentwicklung und Baurecht, 17.10.2019',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bibi-abstellplaetze-merged',
        type: 'circle',
        paint: {
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
          'circle-color': '#0f766e',
          'circle-radius': 4,
          'circle-stroke-color': '#0f766e',
        },
      },
    ],
  },
  {
    regionKey: ['bibi'],
    ...sourceLegacyDatasetIdUrl('bibi-problemstellen'),
    name: 'Radschulwegplan Problemstellen',
    type: 'vector',
    attributionHtml: '&copy; Amt für Stadtentwicklung und Baurecht, 17.10.2019',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bibi-problemstellen',
        type: 'circle',
        paint: {
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
          'circle-color': '#ec4899',
          'circle-radius': 4,
          'circle-stroke-color': '#ec4899',
        },
      },
    ],
  },
  {
    regionKey: ['bibi'],
    ...sourceLegacyDatasetIdUrl('bibi-radschulwegplan-gefahrenstellen'),
    name: 'Radschulwegplan Gefahrenstellen',
    type: 'vector',
    attributionHtml: '&copy; Amt für Stadtentwicklung und Baurecht, Juni 2020',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bibi-radschulwegplan-gefahrenstellen',
        type: 'circle',
        paint: {
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
          'circle-color': '#ec4899',
          'circle-radius': 4,
          'circle-stroke-color': '#ec4899',
        },
      },
    ],
  },
  {
    regionKey: ['bibi'],
    ...sourceLegacyDatasetIdUrl('bibi-empfohlener-radschulweg'),
    name: 'Radschulwegplan Empfohlener Radschulweg',
    type: 'vector',
    attributionHtml: '&copy; Amt für Stadtentwicklung und Baurecht, Juni 2020',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bibi-empfohlener-radschulweg',
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
    regionKey: ['bibi'],
    ...sourceLegacyDatasetIdUrl('bibi-radnetz-alltag'),
    name: 'Alltagsradwegenetz',
    type: 'vector',
    attributionHtml: '&copy; Amt für Stadtentwicklung und Baurecht, Juni 2022',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: false,
      disableTranslations: true,
    },
    layers: [
      {
        id: 'bibi-radnetz-alltag',
        type: 'line',
        paint: {
          'line-color': [
            'case',
            ['match', ['get', 'Art'], ['Nah- und kleinräumige Verbindung'], true, false],
            '#ec4899',
            '#a855f7',
          ],
          'line-opacity': 0.6,
          'line-width': 4,
        },
      },
    ],
  },
  // PARKRAUM:
  {
    regionKey: ['bibi'],
    ...sourceLegacyDatasetIdUrl('bietigheim-bissingen_on_street_parking_lines'),
    name: 'Parkstände',
    type: 'vector',
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: [
        'access__if_present',
        'operator_type__if_present',
        'capacity__if_present',
        'condition_class__if_present',
        'highway__if_present',
        'highway:name__if_present',
        // 'highway:oneway__if_present',
        'informal__if_present',
        'length__if_present',
        'markings__if_present',
        'markings:type__if_present',
        'orientation__if_present',
        'parking__if_present',
        // 'parking_source__if_present',
        // 'side__if_present',
        // 'source:capacity__if_present',
        'surface__if_present',
        // 'vehicle_designated__if_present',
        'width__if_present',
      ],
      editors: [
        {
          name: 'Parklinien Editor',
          urlTemplate: 'https://tordans.github.io/parking-lanes/#{zoom}/{latitude}/{longitude}',
        },
      ],
    },
    layers: [
      {
        id: 'bibi street parking lines',
        type: 'line',
        paint: {
          'line-color': 'rgb(22, 163, 74)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 16, 2, 20, 16],
        },
        filter: ['has', 'capacity'],
      },
      {
        id: 'bibi parallel pattern',
        type: 'line',
        paint: {
          'line-color': 'rgb(237, 237, 237)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 16, 0.7, 20, 5],
          'line-dasharray': [4, 2],
          'line-opacity': 0.67,
        },
        filter: [
          'all',
          ['match', ['get', 'orientation'], ['parallel'], true, false],
          ['has', 'capacity'],
        ],
      },
      {
        minzoom: 16,
        filter: [
          'all',
          ['match', ['get', 'orientation'], ['diagonal'], true, false],
          ['has', 'capacity'],
        ],
        type: 'line',
        id: 'bibi diagonal pattern',
        paint: {
          'line-color': 'rgb(22, 163, 74)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 16, 2, 20, 16],
          'line-opacity': 0.67,
          'line-pattern': 'parking_diagonal',
        },
      },
      {
        minzoom: 16,
        filter: [
          'all',
          ['match', ['get', 'orientation'], ['perpendicular'], true, false],
          ['has', 'capacity'],
        ],
        type: 'line',
        id: 'bibi perpendicular pattern',
        paint: {
          'line-color': 'rgb(22, 163, 74)',
          'line-pattern': 'parking_perpendicular',
          'line-width': ['interpolate', ['linear'], ['zoom'], 16, 2, 20, 16],
          'line-opacity': 0.67,
        },
      },
      {
        id: 'bibi hitarea-parking_line',
        type: 'line',
        paint: {
          'line-width': ['interpolate', ['linear'], ['zoom'], 9, 1, 14.1, 10, 22, 12],
          'line-opacity': 0,
          'line-color': 'hsl(290, 100%, 54%)',
        },
        layout: { 'line-cap': 'round' },
      },
    ],
  },
  {
    regionKey: ['bibi'],
    ...sourceLegacyDatasetIdUrl('bietigheim-bissingen_on_street_parking_lines_label_nodes'),
    name: 'Parkstände Beschriftungen',
    type: 'vector',
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: { enabled: false },
    layers: [
      {
        id: 'bibi-parking_line_label',
        type: 'symbol',
        minzoom: 15,
        layout: {
          'text-allow-overlap': true,
          'text-ignore-placement': true,
          'text-size': ['interpolate', ['linear'], ['zoom'], 14.99, 0, 15, 9, 20, 20],
          'text-field': ['to-string', ['get', 'capacity']],
          'text-rotate': [
            'case',
            ['>', ['get', 'angle'], 90],
            ['-', ['get', 'angle'], 180],
            ['get', 'angle'],
          ],
        },
        paint: {
          'text-color': 'rgb(60, 60, 60)',
          'text-halo-width': ['interpolate', ['linear'], ['zoom'], 15, 1, 18, 2.5],
          'text-halo-color': 'rgb(255, 255, 255)',
          'icon-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0, 14, 0, 15, 1],
        },
      },
    ],
  },
  {
    regionKey: ['bibi'],
    ...sourceLegacyDatasetIdUrl('bietigheim-bissingen_parking_areas'),
    name: 'Parkflächen',
    type: 'vector',
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: {
      enabled: true,
      highlightingKey: 'TODO',
      documentedKeys: [
        'access__if_present',
        'capacity__if_present',
        'capacity:charging__if_present',
        'capacity:disabled__if_present',
        'description__if_present',
        'disabled__if_present',
        'fee__if_present',
        'informal__if_present',
        'markings__if_present',
        // 'markings:type__if_present', // hidden, marked as experimental in https://github.com/osmberlin/parkraum.osm-verkehrswende.org/tree/main/public/project-prototype-neukoelln/data#street_parking_linesgeojson
        'maxheight__if_present',
        'maxstay__if_present',
        'maxstay:conditional__if_present',
        'maxweight__if_present',
        'motorcar__if_present',
        'opening_hours__if_present',
        'operator__if_present',
        'orientation__if_present',
        'parking__if_present',
        'parking:levels__if_present',
        'restriction__if_present',
        'restriction:hgv:conditional__if_present',
        'surface__if_present',
        'taxi__if_present',
        'traffic_sign__if_present',
      ],
      editors: [
        {
          name: 'Parkplätze Editor',
          urlTemplate:
            'https://mapcomplete.osm.be/parkings.html?z={zoom}&lat={latitude}&lon={longitude}&language=de#{osm_type}/{osm_id}',
        },
      ],
    },
    layers: [
      {
        id: 'parking_area',
        type: 'fill',
        paint: {
          'fill-color': [
            'case',
            ['match', ['get', 'parking'], ['underground', 'multi-storey'], true, false],
            'hsl(17, 90%, 80%)',
            ['match', ['get', 'parking'], ['surface'], true, false],
            'hsl(215, 90%, 80%)',
            'hsl(300, 10%, 80%)',
          ],
          'fill-opacity': 0.9,
        },
      },
    ],
  },
]
