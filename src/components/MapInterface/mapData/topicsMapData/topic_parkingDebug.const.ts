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
      layers: [
        mapboxStyleLayers({
          group: 'parking_debug_parking_points',
          source,
          sourceLayer: 'processing.buffer_amenity_parking_points',
        }),
        mapboxStyleLayers({
          group: 'parking_debug_parking_poly',
          source,
          sourceLayer: 'processing.buffer_amenity_parking_poly',
        }),
        mapboxStyleLayers({
          group: 'parking_debug_driveways',
          source,
          sourceLayer: 'processing.buffer_driveways',
        }),
        mapboxStyleLayers({
          group: 'parking_debug_highway_area',
          source,
          sourceLayer: 'processing.buffer_highways',
        }),
        mapboxStyleLayers({
          group: 'parking_debug_kerb',
          source,
          sourceLayer: 'processing.buffer_kerb_intersections',
        }),
        // mapboxStyleLayers({
        //   group: '',
        //   source,
        //   sourceLayer: 'processing.buffer_pedestrian_crossings',
        // }),
        mapboxStyleLayers({
          group: 'parking_debug_bus_tram',
          source,
          sourceLayer: 'processing.buffer_pt_bus',
        }),
        mapboxStyleLayers({
          group: 'parking_debug_bus_tram',
          source,
          sourceLayer: 'processing.buffer_pt_tram',
        }),
        mapboxStyleLayers({
          group: 'parking_debug_ramps',
          source,
          sourceLayer: 'processing.buffer_ramps',
        }),
      ].flat(),
      interactiveFilters: null,
      legends: [
        {
          id: 'buffer_pt_bus',
          name: 'Bushaltestellen',
          style: {
            type: 'fill',
            color: 'rgba(255, 82, 194, 0.7)',
          },
        },
        {
          id: 'buffer_pt_tram',
          name: 'Tramhaltestellen',
          style: {
            type: 'fill',
            color: 'rgba(255, 82, 194, 0.7)',
          },
        },
        // {
        //   id: 'buffer_amenity_parking_points',
        //   name: 'Separat erfasste Parkfläche (Punkt)',
        //   style: {
        //     type: 'fill',
        //     color: 'rgba(80, 139, 134, 0.7)',
        //   },
        // },
        {
          id: 'buffer_amenity_parking_poly',
          name: 'Separat erfasste Parkfläche',
          style: {
            type: 'fill',
            color: 'rgba(80, 139, 134, 0.7)',
          },
        },
        {
          id: 'buffer_driveways',
          name: 'Einfahrt',
          style: {
            type: 'fill',
            color: 'rgba(8, 142, 175, 0.7)',
          },
        },
        {
          id: 'buffer_highways',
          name: 'Straßenflächen',
          style: {
            type: 'fill',
            color: 'rgba(219, 203, 194, 0.4)',
          },
        },
        {
          id: 'buffer_kerb_intersections',
          name: 'Kreuzungszone',
          style: {
            type: 'fill',
            color: 'rgba(233, 89, 12, 0.7)',
          },
        },
        // {
        //   id: 'buffer_pedestrian_crossings',
        //   name: 'Fußgängerübergänge',
        //   style: {
        //     type: 'fill',
        //     color: 'RGBA(217, 98, 43, 0.7)',
        //   },
        // },
        {
          id: 'buffer_ramps',
          name: 'Rampen',
          style: {
            type: 'fill',
            color: 'rgba(80, 85, 139, 0.7)',
          },
        },
      ],
    },
  ],
}
