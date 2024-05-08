import { parseAsString, useQueryState } from 'next-usequerystate'
import { searchParamsRegistry } from './searchParamsRegistry'

export const defaultBackgroundParam = 'default'

export const useBackgroundParam = () => {
  const [backgroundParam, setBackgroundParam] = useQueryState(
    searchParamsRegistry.bg,
    parseAsString.withDefault(defaultBackgroundParam),
  )

  return { backgroundParam, setBackgroundParam }
}
