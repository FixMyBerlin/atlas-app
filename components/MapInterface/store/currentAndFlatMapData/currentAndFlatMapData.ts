import {
  mapDataConfig,
  MapDataConfigTopic,
  MapDataConfigTopicIds,
} from '../../Map/mapData'
import {
  FlatMapData,
  flatMapFilterData,
  flatMapFilterOptionData,
  flatMapStyleData,
  flatMapTopicData,
} from '../flatMapData'
import {
  TopicStyleFilterKey,
  TopicStyleFilterOptionKey,
  TopicStyleKey,
} from '../geschichte'

type Props = {
  selectedTopicIds: MapDataConfigTopicIds[]
  selectedStyleKeys: TopicStyleKey[]
  selectedStylesFilterOptionKeys: TopicStyleFilterOptionKey[]
}

// To make it easier to test but also conventient to use, we have two versions of this helper
// 1. This *forConfig-Version has all the logic and ist tested.
// 2. The version below is the one we use in our app, which will take the mapDataConfig from our .const file.
export const currentAndFlatMapDataForConfig = ({
  thatMapDataConfigTopics,
  selectedTopicIds,
  selectedStyleKeys,
  selectedStylesFilterOptionKeys,
}: Props & {
  thatMapDataConfigTopics: MapDataConfigTopic[]
}) => {
  const currentAndFlatMapDataTopics = flatMapTopicData(thatMapDataConfigTopics)
  const currentAndFlatMapDataStyles = flatMapStyleData(thatMapDataConfigTopics)
  const currentAndFlatMapDataStyleFilters = flatMapFilterData(
    thatMapDataConfigTopics
  )
  const currentAndFlatMapDataStyleFilterOptions = flatMapFilterOptionData(
    thatMapDataConfigTopics
  )

  const selectedStylesFilterKeys = selectedStylesFilterOptionKeys
    .map((key) => key?.split('-')?.splice(-1)?.join('-'))
    .filter(Boolean) as TopicStyleFilterKey[]

  const currentAndFlatMapData: FlatMapData = {
    topics: currentAndFlatMapDataTopics.filter((t) =>
      selectedTopicIds.includes(t.id)
    ),
    styles: currentAndFlatMapDataStyles.filter((s) =>
      selectedStyleKeys.includes(s.key)
    ),
    styleFilters: currentAndFlatMapDataStyleFilters.filter((f) =>
      selectedStylesFilterKeys.includes(f.key)
    ),
    styleFilterOptions: currentAndFlatMapDataStyleFilterOptions.filter(
      (fo) => fo && selectedStylesFilterOptionKeys.includes(fo.key)
    ),
  }

  return currentAndFlatMapData
}

export const currentAndFlatMapData = ({
  selectedTopicIds,
  selectedStyleKeys,
  selectedStylesFilterOptionKeys,
}: Props) => {
  return currentAndFlatMapDataForConfig({
    thatMapDataConfigTopics: mapDataConfig.topics,
    selectedTopicIds,
    selectedStyleKeys,
    selectedStylesFilterOptionKeys,
  })
}
