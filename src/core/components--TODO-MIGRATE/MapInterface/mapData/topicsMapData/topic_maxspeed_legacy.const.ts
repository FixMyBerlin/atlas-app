import { MapDataTopic } from '../types'
import { defaultStyleHidden } from './defaultStyle'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const topicId = 'maxspeed_legacy'
const source = 'tarmac_maxspeed'
const sourceLayer = 'public.maxspeed'
export type TopicMaxspeedIdLegacy = typeof topicId
export type TopicMaxspeedStyleIdsLegacy = 'default' | 'details' | 'source'

export const topic_maxspeed_legacy: MapDataTopic = {
  id: topicId,
  name: 'Höchstgeschwindigkeit',
  desc: '', // todo
  sourceId: source,
  styles: [
    ...defaultStyleHidden,
    {
      id: 'default',
      name: 'Hohe Geschwindigkeiten',
      desc: '', // todo
      layers: mapboxStyleLayers({ group: 'atlas_old_roadclass_maxspeed', source, sourceLayer }),
    },
    {
      id: 'details',
      name: 'Details',
      desc: '', // todo
      layers: mapboxStyleLayers({
        group: 'atlas_old_roadclass_maxspeed_details',
        source,
        sourceLayer,
      }),
    },
  ],
}
