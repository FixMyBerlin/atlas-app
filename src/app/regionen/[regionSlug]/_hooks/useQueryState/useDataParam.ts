import { parseAsArrayOf, parseAsString, useQueryState } from 'next-usequerystate'
import { searchParamsRegistry } from './searchParamsRegistry'

export const useDataParam = () => {
  const [dataParam, setDataParam] = useQueryState(
    searchParamsRegistry.data,
    parseAsArrayOf(parseAsString).withDefault([]),
  )

  return { dataParam, setDataParam }
}
