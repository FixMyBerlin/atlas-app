import { parseAsArrayOf, parseAsString, useQueryState } from 'next-usequerystate'

export const useDataParam = () => {
  const [dataParam, setDataParam] = useQueryState(
    'data',
    parseAsArrayOf(parseAsString).withDefault([]),
  )

  return { dataParam, setDataParam }
}
