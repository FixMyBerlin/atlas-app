import { parseAsBoolean, useQueryState } from 'next-usequerystate'
import { isDev } from 'src/app/_components/utils/isEnv'

export const useDebugMapParam = () => {
  const [debugMapParam, setDebugMap] = useQueryState('debugMap', parseAsBoolean.withDefault(isDev))

  return { debugMapParam, setDebugMap }
}
