import { ErrorBoundary } from '@blitzjs/next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useNewOsmNoteMapParam } from '../../../_hooks/useQueryState/useNotesOsmParams'
import { useStaticRegion } from '../../regionUtils/useStaticRegion'
import { NotesNew } from '../NotesNew/NotesNew'
import { NotesNewMap } from '../NotesNew/NotesNewMap'
import { OsmNotesControls } from './OsmNotesControls'
import { OsmNotesNewForm } from './OsmNotesNewForm'
import { useLoadOsmNotes } from './utils/useLoadOsmNotes'

const osmNotesQueryClient = new QueryClient()

export const OsmNotes = () => {
  const region = useStaticRegion()
  // This will not just hide the UI, but also prevent the query so no data is rendered on the map
  if (!region || region.notes !== 'osmNotes') return null

  return (
    <QueryClientProvider client={osmNotesQueryClient}>
      <OsmNotesWrappedInQUeryClientProvider />
    </QueryClientProvider>
  )
}

const OsmNotesWrappedInQUeryClientProvider = () => {
  const { newOsmNoteMapParam, setNewOsmNoteMapParam } = useNewOsmNoteMapParam()

  const { isLoading, isError } = useLoadOsmNotes()

  return (
    <>
      <OsmNotesControls isLoading={isLoading} isError={isError} />
      <NotesNew
        visible={Boolean(newOsmNoteMapParam)}
        title="Einen Hinweis auf OpenStreetMap veröffentlichen"
      >
        <ErrorBoundary>
          <NotesNewMap
            mapId="newOsmNoteMap"
            newNoteMapParam={newOsmNoteMapParam}
            setNewNoteMapParam={setNewOsmNoteMapParam}
          />
        </ErrorBoundary>
        <OsmNotesNewForm />
      </NotesNew>
    </>
  )
}
