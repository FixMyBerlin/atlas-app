import { TopicStyleFilterKey, TopicStyleKey } from '..'
import {
  MapDataConfigStyleInteractiveFilter,
  MapDataConfigTopic,
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleFilterIds,
} from '../../mapData'
import { createTopicStyleFilterKey, createTopicStyleKey } from '../../utils'

export type FlatMapDataFilter = Omit<
  MapDataConfigStyleInteractiveFilter,
  'options'
> & {
  key: TopicStyleFilterKey
  id: MapDataConfigTopicStyleFilterIds
  topicId: MapDataConfigTopicIds
  styleKey: TopicStyleKey
}

// Handle Filters: Flatten, add helper Ids/Key, remove `options` property
export const flatMapFilterData = (
  thatMapDataConfigTopics: MapDataConfigTopic[]
) => {
  return thatMapDataConfigTopics
    .map((topic) => {
      return topic.styles
        .filter((s) => s.interactiveFilters)
        .map((style) => {
          return style?.interactiveFilters?.map((filter) => {
            const enhancedFilter = {
              ...filter,
              key: createTopicStyleFilterKey(topic.id, style.id, filter.id),
              topicId: topic.id,
              styleKey: createTopicStyleKey(topic.id, style.id),
            }
            return Object.fromEntries(
              Object.entries(enhancedFilter).filter(
                ([key, _]) => key !== 'options'
              )
            )
          })
        })
    })
    .flat(2) as FlatMapDataFilter[]
}
