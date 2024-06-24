import { createParser, parseAsBoolean, useQueryState } from 'nuqs'
import { searchParamsRegistry } from './searchParamsRegistry'
import { parseMapParam, serializeMapParam } from './utils/mapParam'

export const useShowAtlasNotesParam = () => {
  const [showAtlasNotesParam, setShowAtlasNotesParam] = useQueryState(
    searchParamsRegistry.atlasNotes,
    parseAsBoolean.withDefault(false),
  )

  return { showAtlasNotesParam, setShowAtlasNotesParam }
}

export const useNewAtlasNoteMapParam = () => {
  const newAtlasNoteMapParamParser = createParser({
    parse: (query) => parseMapParam(query),
    serialize: (object) => serializeMapParam(object),
  }).withOptions({ history: 'replace' })

  const [newAtlasNoteMapParam, setNewAtlasNoteMapParam] = useQueryState(
    searchParamsRegistry.atlasNote,
    newAtlasNoteMapParamParser,
  )

  return { newAtlasNoteMapParam, setNewAtlasNoteMapParam }
}
