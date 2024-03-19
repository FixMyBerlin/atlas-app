import invariant from 'tiny-invariant'
import { SourcesId } from '../../../../../_mapData/mapDataSources/sources.const'
import { SubcategoryId } from '../../../../../_mapData/typeId'
import { createSourceKey } from '../../../../utils/createKeyUtils/createKeyUtils'

export const extractSubcatIdFromSourceKey = (sourceKey: ReturnType<typeof createSourceKey>) => {
  const regex = /--subcat:(\w+)/
  const match = sourceKey.match(regex)
  invariant(
    match,
    `Did not find subcategory in extractSubcatIdFromSourceKey for sourceKey:${sourceKey}`,
  )
  return match[1] as SubcategoryId
}

export const extractSourceIdIdFromSourceKey = (sourceKey: ReturnType<typeof createSourceKey>) => {
  const regex = /--source:(\w+)/
  const match = sourceKey.match(regex)
  invariant(
    match,
    `Did not find source in extractSourceIdIdFromSourceKey for sourceKey:${sourceKey}`,
  )
  return match[1] as SourcesId
}

export const extractDataIdIdFromDataKey = (sourceKey: string) => {
  // `source:${sourceId}
  return sourceKey.replace('source:', '')
}
