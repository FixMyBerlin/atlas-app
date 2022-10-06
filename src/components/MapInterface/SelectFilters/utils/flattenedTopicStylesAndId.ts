import { createTopicStyleKey } from '@/components/MapInterface/utils'
import {
  mapDataConfig,
  MapDataConfigStyle,
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleIds,
} from '../../mapData'
import { TopicStyleKey } from '../../store'

export const flattenedTopicStylesAndId = () => {
  type FlatTopicStyle = Omit<MapDataConfigStyle, 'id'> & {
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
