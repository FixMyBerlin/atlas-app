import { createParser, parseAsBoolean, parseAsJson, useQueryState } from 'nuqs'
import { searchParamsRegistry } from './searchParamsRegistry'
import { parseMapParam, serializeMapParam } from './utils/mapParam'
import { z } from 'zod'

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

export const zodAtlasFilterParam = z.object({
  query: z.string().optional().nullable(),
  completed: z.boolean().optional().nullable(),
  user: z.coerce.number().optional().nullable(),
  commented: z.boolean().optional().nullable(),
})
type TAtlasFilterParam = z.infer<typeof zodAtlasFilterParam>

export const useAtlasFilterParam = () => {
  const [atlasNotesFilterParam, setAtlasNotesFilterParam] = useQueryState(
    searchParamsRegistry.atlasNotesFilter,
    parseAsJson(zodAtlasFilterParam.parse),
  )

  return { atlasNotesFilterParam, setAtlasNotesFilterParam }
}
