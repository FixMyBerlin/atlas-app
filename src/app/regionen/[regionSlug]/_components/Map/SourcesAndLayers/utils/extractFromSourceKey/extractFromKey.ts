import invariant from 'tiny-invariant'
import { SubcategoryIds } from '../../../../mapData/mapData.const'
import { DatasetIds } from '../../../../mapData/mapDataSources/datasets/types'
import { SourcesIds } from '../../../../mapData/mapDataSources/sources.const'
import { createSourceKey } from '../../../../utils/createKeyUtils/createKeyUtils'

export const extractSubcatIdFromSourceKey = (sourceKey: ReturnType<typeof createSourceKey>) => {
  const regex = /--subcat:(\w+)/
  const match = sourceKey.match(regex)
  invariant(
    match,
    `Did not find subcategory in extractSubcatIdFromSourceKey for sourceKey:${sourceKey}`,
  )
  return match[1] as SubcategoryIds
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
