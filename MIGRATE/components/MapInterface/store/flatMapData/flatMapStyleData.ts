import { TopicStyleKey } from '..'
import {
  MapDataConfigStyles,
  MapDataConfigTopic,
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleIds,
} from '../../Map/mapData'
import { createTopicStyleKey, deleteKeyFromObject } from '../../utils'

export type FlatMapDataStyle = Omit<
  MapDataConfigStyles,
  'interactiveLayers'
> & {
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
