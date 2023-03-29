import { FilterDataWithConfigState } from './types'

export const filterArrayFromMergedDataAndConfig = (
  mergedFilterDataAndConfig: FilterDataWithConfigState
) => {
  const activeOptionIds = mergedFilterDataAndConfig.options.filter((o) => o.active).map((o) => o.id)
  const key = mergedFilterDataAndConfig.filterConfig.lookupKey

  const filter = ['match', ['get', key], activeOptionIds, true, false]

  return filter
}
