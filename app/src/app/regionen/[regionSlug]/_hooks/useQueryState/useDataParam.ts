import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { memoize } from 'lodash'
import { searchParamsRegistry } from './searchParamsRegistry'

const memoized = memoize(
  (data) => data,
  ({ dataParam: selectedDatasetIds }) => selectedDatasetIds.join(),
)

export const useDataParam = () => {
  const [dataParam, setDataParam] = useQueryState(
    searchParamsRegistry.data,
    parseAsArrayOf(parseAsString).withDefault([]),
  )

  return memoized({ dataParam, setDataParam }) as {
    dataParam: typeof dataParam
    setDataParam: typeof setDataParam
  }
}
