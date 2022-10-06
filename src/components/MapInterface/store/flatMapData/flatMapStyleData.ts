import { TopicStyleKey } from '..'
import {
  MapDataConfigStyle,
  MapDataConfigTopic,
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleIds,
} from '../../mapData'
import { createTopicStyleKey, deleteKeyFromObject } from '../../utils'

export type FlatMapDataStyle = Omit<MapDataConfigStyle, 'interactiveLayers'> & {
  key: TopicStyleKey
  id: MapDataConfigTopicStyleIds
  topicId: MapDataConfigTopicIds
}

// Handle Styles: Flatten, add helper Ids/Key, remove `interactiveFilters` property
export const flatMapStyleData = (
  thatMapDataConfigTopics: MapDataConfigTopic[]
) => {
  return thatMapDataConfigTopics
    .map((topic) => {
      return topic.styles.map((style) => {
        const enhancedStyle = {
          ...style,
          key: createTopicStyleKey(topic.id, style.id),
          topicId: topic.id,
        }
        return deleteKeyFromObject(enhancedStyle, 'interactiveFilters')
      })
    })
    .flat() as FlatMapDataStyle[]
}
