import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleGroupLayers_parking_parkinglines } from './mapboxStyles/groups/parking_parkinglines'
import { mapboxStyleGroupLayers_parking_parkinglines_completeness } from './mapboxStyles/groups/parking_parkinglines_completeness'
import { mapboxStyleGroupLayers_parking_parkinglines_labels } from './mapboxStyles/groups/parking_parkinglines_labels'
import { mapboxStyleGroupLayers_parking_parkinglines_surface } from './mapboxStyles/groups/parking_parkinglines_surface'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'parking'
const source = 'parkraumParking'
const sourceLayer = 'processing.parking_segments'
export type SubcatParkingId = typeof subcatId
export type SubcatParkingStyleIds = 'default' | 'presence' | 'surface' | 'raw'

export const subcat_parking: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Parkraum',
  ui: 'dropdown',
  sourceId: 'parkraumParking',
  beforeId: undefined,
  styles: [
    defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_parking_parkinglines,
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_parking_parkinglines_labels,
          source: 'parkraumParking',
          sourceLayer: 'processing.parking_segments_label',
        }),
      ].flat(),
    },
    {
      id: 'presence',
      name: 'Vollständigkeit',
      desc: null,
      layers: [
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_parking_parkinglines_labels,
          source: 'parkraumParking',
          sourceLayer: 'processing.parking_segments_label',
        }),
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_parking_parkinglines_completeness,
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_parking_parkinglines,
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'capacity_status--present',
          name: 'Parkstände',
          style: {
            type: 'line',
            color: 'rgb(22, 163, 74)',
          },
        },
        {
          id: 'capacity_status--presetn--operator_type-private',
          name: 'Parkstände an Privatwegen',
          style: {
            type: 'line',
            color: 'rgba(22, 163, 74, 0.33)',
          },
        },
        {
          id: 'capacity_status--data_missing',
          name: 'Daten fehlen noch',
          style: {
            type: 'line',
            color: 'rgb(187, 17, 133)',
          },
        },
        {
          id: 'capacity_status--data_missing',
          name: 'Daten nicht erwartet',
          desc: ['Gilt für Zufahrten und Fußgängerzonen'],
          style: {
            type: 'line',
            color: 'rgba(187, 17, 133, 0.25)',
          },
        },
        {
          id: 'capacity_status--no_parking',
          name: 'Parkverbot erfasst',
          style: {
            type: 'line',
            color: 'rgb(102, 21, 168)',
          },
        },
        {
          id: 'capacity_status--segment_too_small',
          name: 'Segment zu klein',
          style: {
            type: 'line',
            color: 'rgb(99, 53, 50)',
          },
        },
      ],
    },
    {
      id: 'surface',
      name: 'Oberflächen',
      desc: null,
      layers: [
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_parking_parkinglines_labels,
          source: 'parkraumParking',
          sourceLayer: 'processing.parking_segments_label',
        }),
        mapboxStyleLayers({
          layers: mapboxStyleGroupLayers_parking_parkinglines_surface,
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'surface-soft',
          name: 'Durchlässig',
          style: {
            type: 'line',
            color: 'hsl(142, 94%, 40%)',
          },
        },
        {
          id: 'surface-gaps',
          name: 'Etwas durchlässig',
          style: {
            type: 'line',
            color: 'hsl(164, 92%, 42%)',
          },
        },
        {
          id: 'surface-closed',
          name: 'Undurchlässig',
          style: {
            type: 'line',
            color: 'hsl(344, 93%, 35%)',
          },
        },
        {
          id: 'surface-unknown',
          name: 'Unkategorisiert',
          style: {
            type: 'line',
            color: 'hsl(280, 94%, 63%)',
          },
        },
      ],
    },
  ],
}
