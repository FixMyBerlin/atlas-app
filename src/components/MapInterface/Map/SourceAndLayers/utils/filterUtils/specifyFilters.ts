import { MapDataStyleInteractiveFilter } from '@components/MapInterface/mapData'
import { TopicStyleFilterConfig } from '@components/MapInterface/mapStateConfig'
import { filterArrayFromMergedDataAndConfig } from './filterArrayFromMergedDataAndConfig'
import { flattenFilterArrays } from './flattenFilterArrays'
import { mergeFilterDataWithConfig } from './mergeFilterDataWithConfig'
import { wrapFilterWithAll } from './wrapFilterWithAll'

export const specifyFilters = (
  layerFilter: undefined | any[],
  filtersData: undefined | null | MapDataStyleInteractiveFilter[],
  filtersConfig: undefined | null | TopicStyleFilterConfig[]
) => {
  if (!filtersData || !filtersConfig) {
    return wrapFilterWithAll(layerFilter)
  }

  const filterDataAndConfig = mergeFilterDataWithConfig(
    filtersData,
    filtersConfig
  )
  const filtersArray = filterDataAndConfig.map((f) =>
    filterArrayFromMergedDataAndConfig(f)
  )
  const mergedFiltersArray = flattenFilterArrays(layerFilter, filtersArray)
  return wrapFilterWithAll(mergedFiltersArray)
}
