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
  name: 'Einkauf u.ä.',
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
      legends: [
        {
          id: 'freizeit',
          name: 'Freizeit',
          style: { type: 'circle', color: '#960854' },
        },
        {
          id: 'bildung',
          name: 'Bildung',
          style: { type: 'circle', color: '#626060' },
        },
        {
          id: 'besorgungen',
          name: 'Besorgungen',
          style: { type: 'circle', color: '#e709fb' },
        },
        {
          id: 'einkauf',
          name: 'Einkauf',
          style: { type: 'circle', color: '#0e3ecd' },
        },
      ],
      interactiveFilters: null,
    },
  ],
}
