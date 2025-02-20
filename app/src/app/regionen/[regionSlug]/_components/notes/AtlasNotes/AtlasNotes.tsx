import { SmallSpinner } from '@/src/app/_components/Spinner/SmallSpinner'
import getNotesAndCommentsForRegion from '@/src/server/notes/queries/getNotesAndCommentsForRegion'
import { ErrorBoundary } from '@blitzjs/next'
import { useQuery } from '@blitzjs/rpc'
import { Suspense } from 'react'
import {
  useAtlasFilterParam,
  useNewAtlasNoteMapParam,
} from '../../../_hooks/useQueryState/useNotesAtlasParams'
import { useRegionSlug } from '../../regionUtils/useRegionSlug'
import { NotesNew } from '../NotesNew/NotesNew'
import { NotesNewMap } from '../NotesNew/NotesNewMap'
import { AtlasNotesControls } from './AtlasNotesControls'
import { AtlasNotesNewForm } from './AtlasNotesNewForm'
import { useAllowAtlasNotes } from './utils/useAllowAtlasNotes'
import { useQueryKey } from './utils/useQueryKey'

export const AtlasNotes = () => {
  const allowAtlasNotes = useAllowAtlasNotes()
  // This will not just hide the UI, but also prevent the query so no data is rendered on the map
  if (!allowAtlasNotes) return null

  return (
    <Suspense fallback={<SmallSpinner />}>
      <AtlasNotesSuspended />
    </Suspense>
  )
}

const AtlasNotesSuspended = () => {
  const { newAtlasNoteMapParam, setNewAtlasNoteMapParam } = useNewAtlasNoteMapParam()
  const { atlasNotesFilterParam } = useAtlasFilterParam()

  const queryKey = useQueryKey()
  const regionSlug = useRegionSlug()!
  // For now, we load all notes. We will want to scope this to the viewport later.
  const [{ stats }, { isLoading, isError, error }] = useQuery(
    getNotesAndCommentsForRegion,
    { regionSlug, filter: atlasNotesFilterParam },
    { queryKey },
  )

  if (isError) {
    console.error('Error when loading notes from', error)
  }

  return (
    <>
      <AtlasNotesControls
        totalNotes={stats?.filteredTotal}
        isLoading={isLoading}
        isError={isError}
      />
      <NotesNew visible={Boolean(newAtlasNoteMapParam)} title="Einen internen Hinweis hinterlassen">
        <ErrorBoundary>
          <NotesNewMap
            mapId="newAtlasNoteMap"
            newNoteMapParam={newAtlasNoteMapParam}
            setNewNoteMapParam={setNewAtlasNoteMapParam}
          />
        </ErrorBoundary>
        <AtlasNotesNewForm />
      </NotesNew>
    </>
  )
}
