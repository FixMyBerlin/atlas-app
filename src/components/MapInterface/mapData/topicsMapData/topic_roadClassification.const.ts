import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topicId = 'roadClassification'
const source = 'tarmac_roads'
const sourceLayer = 'public.roads'
export type TopicRoadClassificationId = typeof topicId
export type TopicRoadClassificationStyleIds = 'default' | 'oneway' | 'road_implicit_shared_lane'
export const topic_roadClassification: MapDataTopic = {
  id: topicId,
  name: 'Straßentypen (new)',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: 'Straßenklassifieriung auf Basis von OpenStreetMap Straßentypen.',
      layers: mapboxStyleLayers({
        group: 'atlas_roadclassification',
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'unclassified',
          name: 'Nebenstraße (…)',
          style: { type: 'line', color: '#e6d6a2' },
        },
        {
          id: 'tertiary',
          name: 'Kreisstraße (…)',
          style: { type: 'line', color: '#dab07c' },
        },
        { id: 'residential', name: 'Wohngebiet', style: { type: 'line', color: '#9a987e' } },
        {
          id: 'path-track-bridleway',
          name: 'Pfad, Wald-, Feldweg (…)',
          style: { type: 'line', color: '#b4aac0' },
        },
        {
          id: 'primary-motorway-secondary-trunk',
          name: 'Verbindungsstraße (…)',
          style: { type: 'line', color: '#dab07c' },
        },
        {
          id: 'living_street-pedestrian-bicycle_road',
          name: 'Verkehrsberuhigt (…)',
          style: { type: 'line', color: '#80a3ea' },
        },
        {
          id: 'footway-cycleway',
          name: 'Fuß- & Radwege',
          style: { type: 'line', color: '#b9aac0' },
        },
        {
          id: 'service_road-service_alley',
          name: 'Zufahrtsweg',
          style: { type: 'line', color: '#e6d6a2' },
        },
        // {
        //   id: 'service_drive_through-service_parking_aisle',
        //   name: 'Zufahrtsweg (…)',
        //   style: { type: 'line', color: 'rgba(251, 40, 40, 0)' },
        // },
      ],
    },
    {
      id: 'oneway',
      name: 'Einbahnstrahßen',
      desc: 'Hervorhebung von Einbahnstraßen.',
      layers: [
        mapboxStyleLayers({
          group: 'atlas_oneway',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'atlas_roadclassification',
          source,
          sourceLayer,
        }),
      ].flat(),
      legends: [
        {
          id: 'car_and_bike',
          name: 'Einbahnstraße',
          style: {
            type: 'line',
            color: 'rgb(255, 131, 82)',
          },
        },
        {
          id: 'car_not_bike',
          name: 'Einbahnstraße, Fahrrad frei',
          style: {
            type: 'line',
            color: 'rgb(211, 238, 88)',
          },
        },
      ],
    },
    {
      id: 'road_implicit_shared_lane',
      name: 'Mischverkehr',
      desc: 'Fahrrad führung im Mischverkehr.',
      layers: mapboxStyleLayers({
        group: 'atlas_mischverkehr',
        source,
        sourceLayer,
      }),
      legends: undefined,
    },
  ],
}
