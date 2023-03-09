import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'parkingDebug'
const source = 'parkraumParkingDebug'
export type TopicParkingDebugId = typeof topic
export type TopicParkingDebugStyleIds =
  | 'default'
  | 'presence'
  | 'debugLengthPerCapacity'
export type TopicParkingDebugStyleFilterIds = '_nofilter'

export const topic_parkingDebug: MapDataTopic = {
  id: topic,
  name: 'Parkraum Debug',
  desc: '',
  sourceId: 'parkraumParkingDebug',
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      // layers: [
      //   {
      //     id: 'buffer_pt_bus',
      //     type: 'fill',
      //     source,
      //     'source-layer': 'processing.buffer_pt_bus',
      //     paint: {
      //       'fill-color': 'RGBA(142, 59, 31, 0.7)',
      //     },
      //     layout: {},
      //   },
      //   {
      //     id: 'buffer_pt_tram',
      //     type: 'fill',
      //     source,
      //     'source-layer': 'processing.buffer_pt_tram',
      //     paint: {
      //       'fill-color': 'RGBA(142, 59, 31, 0.7)',
      //     },
      //     layout: {},
      //   },
      //   {
      //     id: 'buffer_amenity_parking_points',
      //     type: 'fill',
      //     source,
      //     'source-layer': 'processing.buffer_amenity_parking_points',
      //     paint: {
      //       'fill-color': '#a21caf',
      //     },
      //     layout: {},
      //   },
      //   {
      //     id: 'buffer_driveways',
      //     type: 'fill',
      //     source,
      //     'source-layer': 'processing.buffer_driveways',
      //     paint: {
      //       'fill-color': 'RGBA(217, 98, 43, 0.7)',
      //     },
      //     layout: {},
      //   },
      //   {
      //     id: 'buffer_highways',
      //     type: 'fill',
      //     source,
      //     'source-layer': 'processing.buffer_highways',
      //     paint: {
      //       'fill-color': 'RGBA(217, 98, 43, 0.7)',
      //     },
      //     layout: {},
      //   },
      //   {
      //     id: 'buffer_kerb_intersections',
      //     type: 'fill',
      //     source,
      //     'source-layer': 'processing.buffer_kerb_intersections',
      //     paint: {
      //       'fill-color': 'RGBA(217, 98, 43, 0.7)',
      //     },
      //     layout: {},
      //   },
      //   {
      //     id: 'buffer_pedestrian_crossings',
      //     type: 'fill',
      //     source,
      //     'source-layer': 'processing.buffer_pedestrian_crossings',
      //     paint: {
      //       'fill-color': 'RGBA(217, 98, 43, 0.7)',
      //     },
      //     layout: {},
      //   },
      //   {
      //     id: 'buffer_ramps',
      //     type: 'fill',
      //     source,
      //     'source-layer': 'processing.buffer_ramps',
      //     paint: {
      //       'fill-color': 'RGBA(217, 98, 43, 0.7)',
      //     },
      //     layout: {},
      //   },
      // ],
      layers: mapboxStyleLayers({
        group: 'parking_debug_kerb',
        source,
        sourceLayer: 'processing.buffer_kerb_intersections',
      }),
      interactiveFilters: null,
      legends: [
        {
          id: 'buffer_pt_bus',
          name: 'Bushaltestellen',
          style: {
            type: 'fill',
            color: 'RGBA(142, 59, 31, 0.7)',
          },
        },
        {
          id: 'buffer_pt_tram',
          name: 'Tramhaltestellen',
          style: {
            type: 'fill',
            color: 'RGBA(142, 59, 31, 0.7)',
          },
        },
        {
          id: 'buffer_amenity_parking_points',
          name: '? "buffer_amenity_parking_points"',
          style: {
            type: 'fill',
            color: 'RGBA(142, 59, 31, 0.7)',
          },
        },
        {
          id: 'buffer_driveways',
          name: 'Einfahrt',
          style: {
            type: 'fill',
            color: 'RGBA(217, 98, 43, 0.7)',
          },
        },
        {
          id: 'buffer_highways',
          name: 'Kreuzungen',
          style: {
            type: 'fill',
            color: 'RGBA(217, 98, 43, 0.7)',
          },
        },
        {
          id: 'buffer_kerb_intersections',
          name: 'Kreuzungszone',
          style: {
            type: 'fill',
            color: 'RGBA(217, 98, 43, 0.7)',
          },
        },
        {
          id: 'buffer_pedestrian_crossings',
          name: 'Fußgängerübergänge',
          style: {
            type: 'fill',
            color: 'RGBA(217, 98, 43, 0.7)',
          },
        },
        {
          id: 'buffer_ramps',
          name: 'Rampen',
          style: {
            type: 'fill',
            color: 'RGBA(217, 98, 43, 0.7)',
          },
        },
      ],
    },
  ],
}
