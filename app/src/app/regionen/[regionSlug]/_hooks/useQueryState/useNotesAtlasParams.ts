import { createParser, parseAsBoolean, parseAsJson, useQueryState } from 'nuqs'
import { searchParamsRegistry } from './searchParamsRegistry'
import { parseMapParam, serializeMapParam } from './utils/mapParam'
import { z } from 'zod'
import { createMemoizer } from './utils/createMemoizer'

const useShowAtlasNotesParamMemoizer = createMemoizer()
const useNewAtlasNoteMapParamMemoizer = createMemoizer()
const useAtlasFilterParamMemoizer = createMemoizer()

export const useShowAtlasNotesParam = () => {
  const [showAtlasNotesParam, setShowAtlasNotesParam] = useQueryState(
    searchParamsRegistry.atlasNotes,
    parseAsBoolean.withDefault(false),
  )
  return useShowAtlasNotesParamMemoizer({ showAtlasNotesParam, setShowAtlasNotesParam })
}

const newAtlasNoteMapParamParser = createParser({
  parse: (query) => parseMapParam(query),
  serialize: (object) => serializeMapParam(object),
}).withOptions({ history: 'replace' })

export const useNewAtlasNoteMapParam = () => {
  const [newAtlasNoteMapParam, setNewAtlasNoteMapParam] = useQueryState(
    searchParamsRegistry.atlasNote,
    newAtlasNoteMapParamParser,
  )
  return useNewAtlasNoteMapParamMemoizer({ newAtlasNoteMapParam, setNewAtlasNoteMapParam })
}

export const zodAtlasFilterParam = z.object({
  query: z.string().optional().nullable(),
  completed: z.boolean().optional().nullable(),
  user: z.coerce.number().optional().nullable(),
  commented: z.boolean().optional().nullable(),
})

export const useAtlasFilterParam = () => {
  const [atlasNotesFilterParam, setAtlasNotesFilterParam] = useQueryState(
    searchParamsRegistry.atlasNotesFilter,
    parseAsJson(zodAtlasFilterParam.parse),
  )
  return useAtlasFilterParamMemoizer({ atlasNotesFilterParam, setAtlasNotesFilterParam })
}
