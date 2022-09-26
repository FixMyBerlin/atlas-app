import { mapDataConfig, MapDataConfigTopic } from '../../Map/mapData'
import { FlatMapDataFilter, flatMapFilterData } from './flatMapFilterData'
import {
  FlatMapDataFilterOption,
  flatMapFilterOptionData,
} from './flatMapFilterOptionData'
import { FlatMapDataStyle, flatMapStyleData } from './flatMapStyleData'
import { FlatMapDataTopic, flatMapTopicData } from './flatMapTopicData'

type Props = {
  thatMapDataConfigTopics: MapDataConfigTopic[]
}

export type FlatMapData = {
  topics: FlatMapDataTopic[]
  styles: FlatMapDataStyle[]
  styleFilters: FlatMapDataFilter[]
  styleFilterOptions: FlatMapDataFilterOption[]
}

export const flatMapDataForConfig = ({ thatMapDataConfigTopics }: Props) => {
  const flatMapDataTopics = flatMapTopicData(thatMapDataConfigTopics)
  const flatMapDataStyles = flatMapStyleData(thatMapDataConfigTopics)
  const flatMapDataStyleFilters = flatMapFilterData(thatMapDataConfigTopics)
  const flatMapDataStyleFilterOptions = flatMapFilterOptionData(
    thatMapDataConfigTopics
  )

  const flatMapData: FlatMapData = {
    topics: flatMapDataTopics,
    styles: flatMapDataStyles,
    styleFilters: flatMapDataStyleFilters,
    styleFilterOptions: flatMapDataStyleFilterOptions,
  }

  return flatMapData
}

export const flatMapData = () => {
  return flatMapDataForConfig({ thatMapDataConfigTopics: mapDataConfig.topics })
}
