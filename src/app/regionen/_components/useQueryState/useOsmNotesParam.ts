import { parseAsBoolean, useQueryState } from 'next-usequerystate'

export const useOsmNotesParam = () => {
  const [osmNotesParam, setOsmNotesParam] = useQueryState(
    'osmNotes',
    parseAsBoolean.withDefault(false),
  )

  return { osmNotesParam, setOsmNotesParam }
}
