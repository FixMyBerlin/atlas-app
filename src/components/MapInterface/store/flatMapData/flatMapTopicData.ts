import { MapDataConfigTopic } from '../../mapData'
import { deleteKeyFromObject } from '../../utils'

export type FlatMapDataTopic = Omit<MapDataConfigTopic, 'styles'>

// Handle Topics: Remove the `styles` property
export const flatMapTopicData = (
  thatMapDataConfigTopics: MapDataConfigTopic[]
) => {
  return thatMapDataConfigTopics.map((topic) => {
    return deleteKeyFromObject(topic, 'styles')
  }) as FlatMapDataTopic[]
}
