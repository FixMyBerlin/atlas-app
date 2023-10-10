'use client'

import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'barriers'
const source = 'tarmac_barriers'
export type TopicBarriersId = typeof topic
export type TopicBarriersStyleIds = 'default'

export const topic_barriers: MapDataTopic = {
  id: topic,
  name: 'Barrieren',
  desc: null,
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: [
        mapboxStyleLayers({
          group: 'atlas_barriers__area',
          source,
          sourceLayer: 'public.barrierAreas',
        }),
        mapboxStyleLayers({
          group: 'atlas_barriers__line',
          source,
          sourceLayer: 'public.barrierLines',
        }),
      ].flat(),
    },
  ],
}
