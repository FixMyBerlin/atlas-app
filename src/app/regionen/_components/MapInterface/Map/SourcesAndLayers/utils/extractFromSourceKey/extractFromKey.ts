import invariant from 'tiny-invariant'
import { TopicIds } from '../../../../mapData/mapData.const'
import { DatasetIds } from '../../../../mapData/sourcesMapData/datasets/types'
import { SourcesIds } from '../../../../mapData/sourcesMapData/sources.const'
import { createSourceKey } from '../../../../utils/createKeyUtils/createKeyUtils'

export const extractTopicIdFromSourceKey = (sourceKey: ReturnType<typeof createSourceKey>) => {
  const regex = /--topic:(\w+)/
  const match = sourceKey.match(regex)
  invariant(match, `Did not find topic in extractTopicIdFromSourceKey for sourceKey:${sourceKey}`)
  return match[1] as TopicIds
}

export const extractSourceIdIdFromSourceKey = (sourceKey: ReturnType<typeof createSourceKey>) => {
  const regex = /--source:(\w+)/
  const match = sourceKey.match(regex)
  invariant(
    match,
    `Did not find source in extractSourceIdIdFromSourceKey for sourceKey:${sourceKey}`,
  )
  return match[1] as SourcesIds
}

export const extractDataIdIdFromDataKey = (sourceKey: string) => {
  // `source:${sourceId}--tiles--pmTiles-are-ready-${pmTilesProtocolReady}`
  return sourceKey.split('--')[0]!.replace('source:', '') as DatasetIds
}
