import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { debugLayerStyles } from './mapboxStyles/debugLayerStyles'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'trafficSigns'
const source = 'atlas_trafficSigns'
const sourceLayer = 'public.trafficSigns'
export type TopicTrafficSignsId = typeof topic
export type TopicTrafficSignsStyleIds = 'default'

export const topic_trafficSigns: MapDataTopic = {
  id: topic,
  name: 'Verkehrszeichen',
  desc: null,
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: debugLayerStyles({
        source,
        sourceLayer: sourceLayer,
      }),
      // layers: mapboxStyleLayers({
      //   group: 'atlas_bikeparking_points',
      //   source,
      //   sourceLayer,
      // }),
      // legends: [
      //   {
      //     id: 'children',
      //     name: 'Kindergarten',
      //     style: {
      //       type: 'circle',
      //       color: 'rgb(119, 23, 171)',
      //     },
      //   },
      //   {
      //     id: 'older',
      //     name: 'Schule bis Uni',
      //     style: {
      //       type: 'circle',
      //       color: 'hsl(209, 76%, 38%)',
      //     },
      //   },
      // ],
    },
  ],
}
