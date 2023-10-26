import invariant from 'tiny-invariant'
import { mapData, TopicIds, TopicStyleIds } from '../mapData.const'
import { SourcesIds } from '../sourcesMapData/sources.const'
import {
  sourcesDatasets,
  SourcesDatasetsIds,
} from '../sourcesMapData/sourcesDatasets/sourcesDatasets.const'
import { MapDataThemeIds, themes } from '../themesMapData/themes.const'
import { MapDataStyle, MapDataTopic } from '../types'

export const getThemeData = (themeId: MapDataThemeIds | undefined) => {
  const themeData = themes.find((the) => the.id === themeId)
  invariant(themeData, 'getThemeData: themeData required')
  return themeData
}
export const getTopicData = (topicId: TopicIds | undefined) => {
  const topicData = mapData?.topics.find((t) => t.id === topicId)
  invariant(topicData, `getTopicData: topicData for ${topicId} missing`)
  return topicData
}

export const getStyleData = (
  topicData: MapDataTopic | undefined,
  styleId: TopicStyleIds | undefined,
) => {
  const styleData = topicData?.styles.find((s) => s.id === styleId)
  invariant(styleData, `getStyleData: styleData for ${styleId} missing`)
  return styleData
}

export const getSourceData = (sourceId: SourcesIds) => {
  const sourceData = mapData?.sources?.find((s) => s.id === sourceId)
  invariant(sourceData, `getSourceData: sourceData for ${sourceId} missing`)
  return sourceData
}

export const getDatasetOrSourceData = (sourceId: SourcesDatasetsIds | SourcesIds) => {
  const sourceData = mapData?.sources?.find((s) => s.id === sourceId)
  const datasetData = sourcesDatasets?.find((s) => s.id === sourceId)
  return sourceData || datasetData
}
