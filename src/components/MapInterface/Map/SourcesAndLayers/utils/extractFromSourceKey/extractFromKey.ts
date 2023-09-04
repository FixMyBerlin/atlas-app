import { SourcesIds, TopicIds } from '@components/MapInterface/mapData'
import { DatasetIds } from '@components/MapInterface/mapData/sourcesMapData/datasets'

export const extractTopicIdFromSourceKey = (sourceKey: string) => {
  return sourceKey.split('--')[2].replace('topic:', '') as TopicIds
}

export const extractSourceIdIdFromSourceKey = (sourceKey: string) => {
  return sourceKey.split('--')[0].replace('source:', '') as SourcesIds
}

export const extractDataIdIdFromDataKey = (sourceKey: string) => {
  // `source:${sourceId}--tiles--pmTiles-are-ready-${pmTilesProtocolReady}`
  return sourceKey.split('--')[0].replace('source:', '') as DatasetIds
}
