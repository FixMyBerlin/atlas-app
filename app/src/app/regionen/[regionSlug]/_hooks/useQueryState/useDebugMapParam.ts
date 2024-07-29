import { isDev } from 'src/app/_components/utils/isEnv'
import { searchParamsRegistry } from './searchParamsRegistry'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { createMemoizer } from './utils/createMemoizer'

const memoizer = createMemoizer()

export const useDebugMapParam = () => {
  const [debugMapParam, setDebugMap] = useQueryState(
    searchParamsRegistry.debugMap,
    parseAsBoolean.withDefault(isDev),
  )

  return memoizer({ debugMapParam, setDebugMap })
}
