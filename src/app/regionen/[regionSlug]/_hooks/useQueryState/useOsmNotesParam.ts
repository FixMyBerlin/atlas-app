import { createParser, parseAsBoolean, useQueryState } from 'next-usequerystate'
import { parseMapParam, serializeMapParam } from './utils/mapParam'

export const useOsmNotesParam = () => {
  const [osmNotesParam, setOsmNotesParam] = useQueryState(
    'osmNotes',
    parseAsBoolean.withDefault(false),
  )

  return { osmNotesParam, setOsmNotesParam }
}

export const useNewOsmNoteMapParam = () => {
  const newOsmNoteMapParamParser = createParser({
    parse: (query) => parseMapParam(query),
    serialize: (object) => serializeMapParam(object),
  }).withOptions({ history: 'replace' })

  const [newOsmNoteMapParam, setNewOsmNoteMapParam] = useQueryState(
    'osmNote',
    newOsmNoteMapParamParser,
  )

  return { newOsmNoteMapParam, setNewOsmNoteMapParam }
}
