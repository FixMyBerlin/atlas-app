import { parseAsBoolean, useQueryState } from 'next-usequerystate'
import { isDev } from 'src/app/_components/utils/isEnv'
import { searchParamsRegistry } from './searchParamsRegistry'

export const useDebugMapParam = () => {
  const [debugMapParam, setDebugMap] = useQueryState(
    searchParamsRegistry.debugMap,
    parseAsBoolean.withDefault(isDev),
  )

  return { debugMapParam, setDebugMap }
}
