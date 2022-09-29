import { mapDataConfig, MapDataConfigTopic } from '../../Map/mapData'
import { flatMapFilterOptionData } from '../flatMapData'
import { TopicStyleFilterOptionKey } from '../geschichte'

export const selectedAndFlatMapFilterOptionDataForConfig = (
  thatMapDataConfigTopics: MapDataConfigTopic[],
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
) => {
  const options = flatMapFilterOptionData(thatMapDataConfigTopics)
  return options.filter(
    (fo) => fo && selectedStylesFilterOptionKeys.includes(fo.key)
  )
}

export const selectedAndFlatMapFilterOptionData = (
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
) => {
  return selectedAndFlatMapFilterOptionDataForConfig(
    mapDataConfig.topics,
    selectedStylesFilterOptionKeys
  )
}
