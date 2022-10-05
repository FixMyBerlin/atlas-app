import { mapDataConfig, MapDataConfigTopic } from '../../Map/mapData'
import {
  FlatMapDataFilterOption,
  flatMapFilterOptionData,
} from '../flatMapData'
import { TopicStyleFilterOptionKey } from '../geschichte.TODO_ts'
import { addStateToObject, ObjectWithState } from './addStateToObject'

export const flatFilterOptionsMapDataWithStateForConfig = (
  thatMapDataConfigTopics: MapDataConfigTopic[],
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
): ObjectWithState<FlatMapDataFilterOption>[] => {
  const filterOptions = flatMapFilterOptionData(thatMapDataConfigTopics)
  return filterOptions.map((fo) =>
    addStateToObject<FlatMapDataFilterOption>(
      fo,
      !!fo && selectedStylesFilterOptionKeys.includes(fo.key)
    )
  )
}

export const flatFilterOptionsMapDataWithState = (
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
) => {
  return flatFilterOptionsMapDataWithStateForConfig(
    mapDataConfig.topics,
    selectedStylesFilterOptionKeys
  )
}
