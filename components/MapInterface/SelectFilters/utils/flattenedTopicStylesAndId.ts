import { createTopicStyleKey } from '@/components/MapInterface/utils'
import {
  mapDataConfig,
  MapDataConfigStyles,
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleIds,
} from '../../Map/mapData'
import { TopicStyleKey } from '../../store'

export const flattenedTopicStylesAndId = () => {
  type FlatTopicStyle = Omit<MapDataConfigStyles, 'id'> & {
    id: TopicStyleKey
    originalId: MapDataConfigTopicStyleIds
    topicId: MapDataConfigTopicIds
  }
  let styles: FlatTopicStyle[] = []
  mapDataConfig.topics.forEach((topic) => {
    topic.styles.forEach((style) => {
      styles = [
        ...styles,
        {
          ...style,
          id: createTopicStyleKey(topic.id, style.id),
          originalId: style.id,
          topicId: topic.id,
        },
      ]
    })
  })
  return styles
}
