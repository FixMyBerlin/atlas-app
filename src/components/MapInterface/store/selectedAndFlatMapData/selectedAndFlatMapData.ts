import { MapDataConfigTopic, MapDataConfigTopicIds } from '../../Map/mapData'
import { FlatMapData } from '../flatMapData'
import { TopicStyleFilterOptionKey, TopicStyleKey } from '../geschichte.TODO_ts'
import { selectedAndFlatMapFilterDataForConfig } from './selectedAndFlatMapFilterData'
import { selectedAndFlatMapFilterOptionDataForConfig } from './selectedAndFlatMapFilterOptionData'
import { selectedAndFlatMapStyleDataForConfig } from './selectedAndFlatMapStyleData'
import { selectedAndFlatMapTopicDataForConfig } from './selectedAndFlatMapTopicData'

type Props = {
  thatMapDataConfigTopics: MapDataConfigTopic[]
  selectedTopicIds: MapDataConfigTopicIds[]
  selectedStyleKeys: TopicStyleKey[]
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
}

// To make it easier to test but also conventient to use, we have two versions of this helper
// 1. This *forConfig-Version has all the logic and ist tested.
// 2. The version below is the one we use in our app, which will take the mapDataConfig from our .const file.
export const selectedAndFlatMapDataForConfig = ({
  thatMapDataConfigTopics,
  selectedTopicIds,
  selectedStyleKeys,
  selectedStylesFilterOptionKeys,
}: Props) => {
  const topics = selectedAndFlatMapTopicDataForConfig(
    thatMapDataConfigTopics,
    selectedTopicIds
  )
  const styles = selectedAndFlatMapStyleDataForConfig(
    thatMapDataConfigTopics,
    selectedStyleKeys
  )
  const styleFilters = selectedAndFlatMapFilterDataForConfig(
    thatMapDataConfigTopics,
    selectedStylesFilterOptionKeys
  )
  const styleFilterOptions = selectedAndFlatMapFilterOptionDataForConfig(
    thatMapDataConfigTopics,
    selectedStylesFilterOptionKeys
  )

  const selectedAndFlatMapData: FlatMapData = {
    topics,
    styles,
    styleFilters,
    styleFilterOptions,
  }

  return selectedAndFlatMapData
}
