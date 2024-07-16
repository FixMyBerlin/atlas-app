import { createParser, parseAsBoolean, useQueryState } from 'nuqs'
import { searchParamsRegistry } from './searchParamsRegistry'
import { parseMapParam, serializeMapParam } from './utils/mapParam'

export const useShowOsmNotesParam = () => {
  const [showOsmNotesParam, setShowOsmNotesParam] = useQueryState(
    searchParamsRegistry.osmNotes,
    parseAsBoolean.withDefault(false),
  )

  return { showOsmNotesParam, setShowOsmNotesParam }
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
