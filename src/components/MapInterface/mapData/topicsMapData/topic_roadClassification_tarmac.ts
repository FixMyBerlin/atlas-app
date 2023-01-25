import { MapDataTopic } from '../types'
import { pickLayersByGroup, atlasStyle } from './utils'

const tpoicId = 'roadClassification_tarmac'
export type TopicRoadClassificationId_Tarmac = typeof tpoicId
export type TopicRoadClassificationStyleIds_Tarmac = 'zes' | 'default'
export type TopicRoadClassificationStyleFilterIds_Tarmac = '_nofilter'

export const topic_roadClassification_tarmac: MapDataTopic = {
  id: tpoicId,
  name: 'Straßentypen',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: 'tarmac_roadClassification',
  styles: [
    {
      id: 'default',
      name: 'OpenStreetMap',
      desc: 'Straßenklassifieriung auf Basis von OpenStreetMap Straßentypen.',
      layers: [
        {
          id: 'default',
          type: 'line',
          source: 'tarmac_roadClassification',
          'source-layer': 'public.roadClassification',
          paint: {
            'line-color': 'HotPink',
            'line-width': 10,
          },
          enableCalculator: false,
        },
      ],
      interactiveFilters: null,
    },
    {
      id: 'zes',
      name: 'Erweitert',
      desc: 'Straßenklassifizierung basierend auf verschiedenen OSM Indikatoren.',
      layers: pickLayersByGroup(atlasStyle.layers, 'fmc-strassentypen'),
      interactiveFilters: null,
    },
  ],
}
