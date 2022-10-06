import {
  mapDataConfig,
  MapDataConfigTopic,
  MapDataConfigTopicIds,
} from '../../mapData'
import { flatMapTopicData } from '../flatMapData'

export const selectedAndFlatMapTopicDataForConfig = (
  thatMapDataConfigTopics: MapDataConfigTopic[],
  selectedTopicIds: MapDataConfigTopicIds[]
) => {
  const filters = flatMapTopicData(thatMapDataConfigTopics)
  return filters.filter((t) => selectedTopicIds.includes(t.id))
}

export const selectedAndFlatMapTopicData = (
  selectedTopicIds: MapDataConfigTopicIds[]
) => {
  return selectedAndFlatMapTopicDataForConfig(
    mapDataConfig.topics,
    selectedTopicIds
  )
}
