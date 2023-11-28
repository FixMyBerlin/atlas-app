import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topic = 'education'
const source = 'atlas_poiClassification'
const sourceLayer = 'public.poiClassification'
export type TopicEducationId = typeof topic
export type TopicEducationStyleIds = 'default'

export const topic_education: MapDataTopic = {
  id: topic,
  name: 'Bildungseinrichtungen',
  desc: null,
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: mapboxStyleLayers({
        group: 'atlas_education',
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'children',
          name: 'Kindergarten',
          style: {
            type: 'circle',
            color: 'rgb(119, 23, 171)',
          },
        },
        {
          id: 'older',
          name: 'Schule bis Uni',
          style: {
            type: 'circle',
            color: 'hsl(209, 76%, 38%)',
          },
        },
      ],
    },
  ],
}
