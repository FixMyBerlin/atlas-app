import { parseAsBoolean, useQueryState } from 'next-usequerystate'
import { isDev } from '../utils'

export const useDebugMapParam = () => {
  const [debugMapParam, setDebugMap] = useQueryState('debugMap', parseAsBoolean.withDefault(isDev))

  return { debugMapParam, setDebugMap }
}
