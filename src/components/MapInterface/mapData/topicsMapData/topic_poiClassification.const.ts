import { MapDataTopic } from '../types'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'shops'
const source = 'tarmac_poiClassification'
const sourceLayer = 'public.poiClassification'
export type TopicPoiClassificationId_Tarmac = typeof topic
export type TopicPoiClassificationStyleIds_Tarmac = 'default'
export type TopicPoiClassificationStyleFilterIds_Tarmac = '_nofilter'

export const topic_poiClassification_tarmac: MapDataTopic = {
  id: topic,
  name: 'Einkauf etc',
  desc: null,
  sourceId: source,
  styles: [
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_poiclassification',
        source,
        sourceLayer,
      }),
      interactiveFilters: null,
    },
  ],
}
