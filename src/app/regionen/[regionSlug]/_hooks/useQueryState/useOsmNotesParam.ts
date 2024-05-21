import { createParser, parseAsBoolean, useQueryState } from 'nuqs'
import { searchParamsRegistry } from './searchParamsRegistry'
import { parseMapParam, serializeMapParam } from './utils/mapParam'

export const useOsmNotesParam = () => {
  const [osmNotesParam, setOsmNotesParam] = useQueryState(
    searchParamsRegistry.osmNotes,
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
    searchParamsRegistry.osmNote,
    newOsmNoteMapParamParser,
  )

  return { newOsmNoteMapParam, setNewOsmNoteMapParam }
}
