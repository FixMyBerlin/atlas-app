import { mapDataConfig, MapDataConfigTopic } from '../../Map/mapData'
import { flatMapStyleData } from '../flatMapData'
import { TopicStyleKey } from '../geschichte'

export const selectedAndFlatMapStyleDataForConfig = (
  thatMapDataConfigTopics: MapDataConfigTopic[],
  selectedStyleKeys: TopicStyleKey[]
) => {
  const style = flatMapStyleData(thatMapDataConfigTopics)
  return style.filter((s) => s && selectedStyleKeys.includes(s.key))
}

export const selectedAndFlatMapStyleData = (
  selectedStyleKeys: TopicStyleKey[]
) => {
  return selectedAndFlatMapStyleDataForConfig(
    mapDataConfig.topics,
    selectedStyleKeys
  )
}
