import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topicId = 'roadClassification_legacy'
const source = 'tarmac_roadClassification'
const sourceLayer = 'public.roadClassification'
export type TopicRoadClassificationIdLegacy = typeof topicId
export type TopicRoadClassificationStyleIdsLegacy = 'default' | 'oneway'

export const topic_roadClassification_legacy: MapDataTopic = {
  id: topicId,
  name: 'Straßentypen',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: 'Straßenklassifieriung auf Basis von OpenStreetMap Straßentypen.',
      layers: mapboxStyleLayers({
        group: 'atlas_roadclass_roadclass',
        source,
        sourceLayer,
      }),
      legends: [
        // See https://wiki.openstreetmap.org/wiki/DE:Key:highway
        {
          id: 'primary-motorway-secondary-trunk',
          name: 'Hauptstraßen u.a.',
          style: { type: 'line', width: 9, color: '#dab07c' },
        },
        {
          id: 'tertiary',
          name: 'Verbindungsstraßen',
          style: { type: 'line', width: 7, color: '#dab07c' },
        },
        {
          id: 'unclassified',
          name: 'Nebenstraße u.a.',
          style: { type: 'line', width: 6, color: '#e6d6a2' },
        },
        {
          id: 'residential',
          name: 'Wohnstraße',
          style: { type: 'line', width: 2, color: '#9a987e' },
        },
        {
          id: 'living_street-pedestrian-bicycle_road',
          name: 'Verkehrsberuhigt u.a.',
          style: { type: 'line', width: 2, color: '#80a3ea' },
        },
        {
          id: 'service_road-service_alley',
          name: 'Zufahrtsweg',
          style: { type: 'line', width: 2, color: '#e6d6a2' },
        },
        // {
        //   id: 'service_drive_through-service_parking_aisle',
        //   name: 'Zufahrtsweg (…)',
        //   style: { type: 'line', width: 2, color: 'rgba(251, 40, 40, 0)' },
        // },
        {
          id: 'path-track-bridleway',
          name: 'Pfad, Wald-, Feldweg u.a.',
          style: { type: 'line', width: 2, color: '#b4aac0' },
        },
        {
          id: 'footway-cycleway',
          name: 'Fuß- & Radwege',
          style: { type: 'line', width: 2, color: '#b9aac0' },
        },
      ],
    },
    {
      id: 'oneway',
      name: 'Einbahnstraßen',
      desc: 'Hervorhebung von Einbahnstraßen.',
      layers: [
        mapboxStyleLayers({
          group: 'atlas_roadclass_einbahnstrasse',
          source,
          sourceLayer,
        }),
        mapboxStyleLayers({
          group: 'atlas_roadclass_roadclass',
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
  ],
}
