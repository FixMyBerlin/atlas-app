import {
  TopicStyleFilterKey,
  TopicStyleFilterOptionKey,
  TopicStyleKey,
} from '..'
import {
  MapDataConfigStyleInteractiveFilterOption,
  MapDataConfigTopic,
  MapDataConfigTopicIds,
} from '../../Map/mapData'
import {
  createTopicStyleFilterKey,
  createTopicStyleFilterOptionKey,
  createTopicStyleKey,
} from '../../utils'

export type FlatMapDataFilterOption =
  | (MapDataConfigStyleInteractiveFilterOption & {
      key: TopicStyleFilterOptionKey
      id: string
      topicId: MapDataConfigTopicIds
      styleKey: TopicStyleKey
      filterKey: TopicStyleFilterKey
    })
  | null

// Handle FilterOptions: Flatten, add helper Ids/Key
export const flatMapFilterOptionData = (
  thatMapDataConfigTopics: MapDataConfigTopic[]
) => {
  return thatMapDataConfigTopics
    .map((topic) => {
      return topic.styles
        .filter((s) => s?.interactiveFilters)
        .map((style) => {
          return style?.interactiveFilters?.map((filter) => {
            return filter.options.map((option) => {
              const enhancedOption = {
                ...option,
                key: createTopicStyleFilterOptionKey(
                  topic.id,
                  style.id,
                  filter.id,
                  option.id
                ),
                topicId: topic.id,
                styleKey: createTopicStyleKey(topic.id, style.id),
                filterKey: createTopicStyleFilterKey(
                  topic.id,
                  style.id,
                  filter.id
                ),
              }
              return enhancedOption
            })
          })
        })
    })
    .flat(3) as FlatMapDataFilterOption[]
}
