import { createParser, parseAsBoolean, useQueryState } from 'nuqs'
import { searchParamsRegistry } from './searchParamsRegistry'
import { createMemoizer } from './utils/createMemoizer'
import { parseMapParam, serializeMapParam } from './utils/mapParam'

const useShowOsmNotesParamMemoizer = createMemoizer()
const useNewOsmNoteMapParamMemoizer = createMemoizer()

export const useShowOsmNotesParam = () => {
  const [showOsmNotesParam, setShowOsmNotesParam] = useQueryState(
    searchParamsRegistry.osmNotes,
    parseAsBoolean.withDefault(false),
  )
  return useShowOsmNotesParamMemoizer({ showOsmNotesParam, setShowOsmNotesParam })
}

const newOsmNoteMapParamParser = createParser({
  parse: (query) => parseMapParam(query),
  serialize: (object) => serializeMapParam(object),
}).withOptions({ history: 'replace' })

export const useNewOsmNoteMapParam = () => {
  const [newOsmNoteMapParam, setNewOsmNoteMapParam] = useQueryState(
    searchParamsRegistry.osmNote,
    newOsmNoteMapParamParser,
  )
  return useNewOsmNoteMapParamMemoizer({ newOsmNoteMapParam, setNewOsmNoteMapParam })
}
