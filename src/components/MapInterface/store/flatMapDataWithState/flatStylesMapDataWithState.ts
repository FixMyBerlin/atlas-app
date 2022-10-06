import { mapDataConfig, MapDataConfigTopic } from '../../mapData'
import { FlatMapDataStyle, flatMapStyleData } from '../flatMapData'
import { TopicStyleKey } from '../geschichte.TODO_ts'
import { addStateToObject, ObjectWithState } from './addStateToObject'

export const flatStylesMapDataWithStateForConfig = (
  thatMapDataConfigTopics: MapDataConfigTopic[],
  selectedStyleKeys: TopicStyleKey[]
): ObjectWithState<FlatMapDataStyle>[] => {
  const styles = flatMapStyleData(thatMapDataConfigTopics)
  return styles.map((s) =>
    addStateToObject<FlatMapDataStyle>(s, selectedStyleKeys.includes(s.key))
  )
}

export const flatStylesMapDataWithState = (
  selectedStyleKeys: TopicStyleKey[]
) => {
  return flatStylesMapDataWithStateForConfig(
    mapDataConfig.topics,
    selectedStyleKeys
  )
}
