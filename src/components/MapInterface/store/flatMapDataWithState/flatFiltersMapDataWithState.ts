import { mapDataConfig, MapDataConfigTopic } from '../../mapData'
import { FlatMapDataFilter, flatMapFilterData } from '../flatMapData'
import {
  TopicStyleFilterKey,
  TopicStyleFilterOptionKey,
} from '../geschichte.TODO_ts'
import { addStateToObject, ObjectWithState } from './addStateToObject'

export const flatFiltersMapDataWithStateForConfig = (
  thatMapDataConfigTopics: MapDataConfigTopic[],
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
): ObjectWithState<FlatMapDataFilter>[] => {
  const filters = flatMapFilterData(thatMapDataConfigTopics)
  const selectedStylesFilterKeys = selectedStylesFilterOptionKeys
    .map((key) => key?.split('-')?.splice(-1)?.join('-'))
    .filter(Boolean) as TopicStyleFilterKey[]

  return filters.map((s) =>
    addStateToObject<FlatMapDataFilter>(
      s,
      selectedStylesFilterKeys.includes(s.key)
    )
  )
}

export const flatFiltersMapDataWithState = (
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
) => {
  return flatFiltersMapDataWithStateForConfig(
    mapDataConfig.topics,
    selectedStylesFilterOptionKeys
  )
}
