import { mapDataConfig, MapDataConfigTopicIds } from '../../Map/mapData'
import { splitTopicStyleFilterOptionKey, splitTopicStyleKey } from '../../utils'
import { TopicStyleFilterOptionKey, TopicStyleKey } from '../geschichte'
import { MapDataConfigTopicsWithState } from './type'

export type Props = {
  selectedTopicIds: MapDataConfigTopicIds[]
  selectedStyleKeys: TopicStyleKey[]
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
}

export const mapDataConfigTopicsWithState = ({
  selectedTopicIds,
  selectedStyleKeys,
  selectedStylesFilterOptionKeys,
}: Props): MapDataConfigTopicsWithState | null => {
  // At startup, the const-file is not preset, apparently
  if (
    mapDataConfig === undefined ||
    selectedTopicIds === null ||
    selectedStyleKeys === null ||
    selectedStylesFilterOptionKeys === null
  ) {
    return null
  }

  return mapDataConfig.topics.map((topic) => {
    return {
      id: topic.id,
      active: selectedTopicIds.includes(topic.id),
      styles: topic.styles.map((style) => {
        const selectedStyleIds = selectedStyleKeys.map((key) => {
          const [_, styleId] = splitTopicStyleKey(key)
          return styleId
        })
        return {
          id: style.id,
          active: selectedStyleIds.includes(style.id),
          filters: style?.interactiveFilters?.map((filter) => {
            return {
              id: filter.id,
              options: filter.options.map((option) => {
                const selectedStylesFilterOptionIds =
                  selectedStylesFilterOptionKeys.map((key) => {
                    const [_1, _2, _3, optionId] =
                      splitTopicStyleFilterOptionKey(key)
                    return optionId
                  })
                return {
                  id: option.id,
                  active: selectedStylesFilterOptionIds.includes(option.id),
                }
              }),
            }
          }),
        }
      }),
    }
  }) as MapDataConfigTopicsWithState
}
