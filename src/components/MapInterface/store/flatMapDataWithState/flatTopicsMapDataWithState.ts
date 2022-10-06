import {
  mapDataConfig,
  MapDataConfigTopic,
  MapDataConfigTopicIds,
} from '../../mapData'
import { FlatMapDataTopic, flatMapTopicData } from '../flatMapData'
import { addStateToObject, ObjectWithState } from './addStateToObject'

export const flatTopicsMapDataWithStateForConfig = (
  thatMapDataConfigTopics: MapDataConfigTopic[],
  selectedTopicIds: MapDataConfigTopicIds[]
): ObjectWithState<FlatMapDataTopic>[] => {
  const filters = flatMapTopicData(thatMapDataConfigTopics)
  return filters.map((t) =>
    addStateToObject<FlatMapDataTopic>(t, selectedTopicIds.includes(t.id))
  )
}

export const flatTopicsMapDataWithState = (
  selectedTopicIds: MapDataConfigTopicIds[]
) => {
  return flatTopicsMapDataWithStateForConfig(
    mapDataConfig.topics,
    selectedTopicIds
  )
}
