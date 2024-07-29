import { parseAsString, useQueryState } from 'nuqs'
import { searchParamsRegistry } from './searchParamsRegistry'
import { createMemoizer } from './utils/createMemoizer'

export const defaultBackgroundParam = 'default'

const memoizer = createMemoizer()

export const useBackgroundParam = () => {
  const [backgroundParam, setBackgroundParam] = useQueryState(
    searchParamsRegistry.bg,
    parseAsString.withDefault(defaultBackgroundParam),
  )

  return memoizer({ backgroundParam, setBackgroundParam })
}
