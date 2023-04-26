import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const tpoicId = 'roadClassification'
const source = 'tarmac_roadClassification'
const sourceLayer = 'public.roadClassification'
export type TopicRoadClassificationId = typeof tpoicId
export type TopicRoadClassificationStyleIds = 'default' | 'oneway'
export type TopicRoadClassificationStyleFilterIds = '_nofilter'

export const topic_roadClassification: MapDataTopic = {
  id: tpoicId,
  name: 'Straßentypen',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: 'Straßenklassifieriung auf Basis von OpenStreetMap Straßentypen.',
      layers: mapboxStyleLayers({
        group: 'atlas_roadclass_roadclass',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
    },
    {
      id: 'oneway',
      name: 'Einbahnstrahßen',
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
      interactiveFilters: null,
    },
  ],
}
