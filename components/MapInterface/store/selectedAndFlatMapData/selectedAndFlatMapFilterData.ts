import { mapDataConfig, MapDataConfigTopic } from '../../Map/mapData'
import { flatMapFilterData } from '../flatMapData'
import { TopicStyleFilterKey, TopicStyleFilterOptionKey } from '../geschichte'

export const selectedAndFlatMapFilterDataForConfig = (
  thatMapDataConfigTopics: MapDataConfigTopic[],
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
) => {
  const filters = flatMapFilterData(thatMapDataConfigTopics)
  const selectedStylesFilterKeys = selectedStylesFilterOptionKeys
    .map((key) => key?.split('-')?.splice(-1)?.join('-'))
    .filter(Boolean) as TopicStyleFilterKey[]

  return filters.filter((f) => selectedStylesFilterKeys.includes(f.key))
}

export const selectedAndFlatMapFilterData = (
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
) => {
  return selectedAndFlatMapFilterDataForConfig(
    mapDataConfig.topics,
    selectedStylesFilterOptionKeys
  )
}
