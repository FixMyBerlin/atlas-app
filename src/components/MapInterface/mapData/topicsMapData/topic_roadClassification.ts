import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const tpoicId = 'roadClassification'
const source = 'tarmac_roadClassification'
export type TopicRoadClassificationId = typeof tpoicId
export type TopicRoadClassificationStyleIds = 'default'
export type TopicRoadClassificationStyleFilterIds = '_nofilter'

export const topic_roadClassification: MapDataTopic = {
  id: tpoicId,
  name: 'Straßentypen',
  desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'OpenStreetMap',
      desc: 'Straßenklassifieriung auf Basis von OpenStreetMap Straßentypen.',
      layers: mapboxStyleLayers({
        group: 'atlas_roadclass_roadclass',
        source,
        sourceLayer: 'public.roadClassification',
      }),
      interactiveFilters: null,
    },
  ],
}
