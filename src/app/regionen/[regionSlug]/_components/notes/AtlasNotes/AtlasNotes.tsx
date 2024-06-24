import { useQuery } from '@blitzjs/rpc'
import { Suspense } from 'react'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import getNotesAndCommentsForRegion from 'src/notes/queries/getNotesAndCommentsForRegion'
import { useNewAtlasNoteMapParam } from '../../../_hooks/useQueryState/useNotesAtlasParams'
import { useRegionSlug } from '../../regionUtils/useRegionSlug'
import { NotesNew } from '../NotesNew/NotesNew'
import { NotesNewMap } from '../NotesNew/NotesNewMap'
import { AtlasNotesControls } from './AtlasNotesControls'
import { AtlasNotesNewForm } from './AtlasNotesNewForm'

export const AtlasNotes = () => {
  return (
    <Suspense fallback={<SmallSpinner />}>
      <AtlasNotesSuspended />
    </Suspense>
  )
}

const AtlasNotesSuspended = () => {
  const { newAtlasNoteMapParam, setNewAtlasNoteMapParam } = useNewAtlasNoteMapParam()

  const regionSlug = useRegionSlug()
  // For now, we load all notes. We will want to scope this to the viewport later.
  const [_, { isLoading, isError, error }] = useQuery(getNotesAndCommentsForRegion, {
    regionSlug,
  })

  if (isError) {
    console.error('Error when loading notes from', error)
  }

  return (
    <>
      <AtlasNotesControls isLoading={isLoading} isError={isError} />
      <NotesNew visible={Boolean(newAtlasNoteMapParam)} title="Einen internen Hinweis hinterlassen">
        <NotesNewMap
          mapId={'newAtlasNoteMap'}
          newNoteMapParam={newAtlasNoteMapParam}
          setNewNoteMapParam={setNewAtlasNoteMapParam}
        />
        <AtlasNotesNewForm />
      </NotesNew>
    </>
  )
}
