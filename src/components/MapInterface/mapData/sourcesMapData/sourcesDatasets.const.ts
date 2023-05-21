import { type DatasetIds, datasets } from './datasets'
import invariant from 'tiny-invariant'
import { MapDataDatasetsSource } from '../types'

export type SourcesDatasetsIds = DatasetIds

const sourceDatasetIdUrl = (datasetId: DatasetIds) => {
  invariant(datasets[datasetId], 'Dataset missing')
  return { id: datasetId, url: `pmtiles://${datasets[datasetId]}` }
}

export const sourcesDatasets: MapDataDatasetsSource<SourcesDatasetsIds>[] = [
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
  {
    regionKey: ['berlin', 'parkraum'],
    ...sourceDatasetIdUrl('berlin-parking-zones-fisbroker'),
    name: 'Parkzonen',
    type: 'vector',
    // https://fbinter.stadt-berlin.de/fb/index.jsp?loginkey=alphaDataStart&alphaDataId=s_parkraumbewirt@senstadt
    attributionHtml: 'Geoportal Berlin / Parkraumbewirtschaftung',
    inspector: { enabled: false },
    layers: [
      {
        id: 'parkraumzonen',
        type: 'line',
        paint: {
          'line-color': '#5b21b6',
          'line-opacity': 0.63,
          'line-width': 2,
        },
      },
    ],
  },
  {
    regionKey: ['bibi'],
    ...sourceDatasetIdUrl('bietigheim-bissingen_on_street_parking_lines'),
    name: 'Parkstände',
    type: 'vector',
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: {
      enabled: true,
      highlightingKey: 'id',
      documentedKeys: [
        'highway_name',
        'highway',
        'parking',
        'capacity_status',
        'orientation',
        'position',
        'capacity',
        'source_capacity__if_present', // unfortunatelly it is always present so we "hide" it for some cases with a "-" translation
        'length',
        'highway_width_proc_effective',
        'surface',
        'operator_type',
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
        id: 'parking_line',
        type: 'line',
        paint: {
          'line-color': '#5b21b6',
          'line-opacity': 0.63,
          'line-width': 2,
        },
      },
    ],
  },
  {
    regionKey: ['bibi'],
    ...sourceDatasetIdUrl('bietigheim-bissingen_parking_areas'),
    name: 'Parkflächen',
    type: 'vector',
    attributionHtml:
      '<a rel="noopener noreferrer" href="https://parkraum.osm-verkehrswende.org/" target="_blank">OSM-Parkraumanalyse</a>, © <a rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    inspector: {
      enabled: true,
      highlightingKey: 'id',
      documentedKeys: [
        'parking',
        'access',
        'operator_type',
        'capacity__if_present',
        'building__if_present',
        'fee__if_present',
        'markings__if_present',
        'orientation__if_present',
        'surface__if_present',
        'description__if_present',
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
  // {
  //   id: 'TrtoNetzentwurf',
  //   name: 'Wunschlinien: Netzentwurf',
  //   type: 'vector',
  //   attributionHtml: 'FixMyCity',
  //   inspector: { enabled: false },
  //   layers: [
  //     {
  //       id: 'netzentwurf',
  //       type: 'line',
  //       paint: {
  //         'line-width': 3,
  //         'line-opacity': 0.83,
  //         'line-color': '#dd0303',
  //         'line-dasharray': [2, 0.7],
  //       },
  //     },
  //   ],
  // },
]
