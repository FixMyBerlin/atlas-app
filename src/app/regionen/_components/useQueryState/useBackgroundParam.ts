import { parseAsString, useQueryState } from 'next-usequerystate'

export const defaultBackgroundParam = 'default'

export const useBackgroundParam = () => {
  const [backgroundParam, setBackgroundParam] = useQueryState(
    'bg',
    parseAsString.withDefault(defaultBackgroundParam),
  )

  return { backgroundParam, setBackgroundParam }
}
