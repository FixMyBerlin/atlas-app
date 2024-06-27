import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getOsmApiUrl } from 'src/app/_components/utils/getOsmUrl'
import { OsmNotesControls } from './OsmNotesControls'
import { NotesNew } from '../NotesNew/NotesNew'
import { useNotesActiveByZoom } from '../utils/useNotesActiveByZoom'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { useStaticRegion } from '../../regionUtils/useStaticRegion'
import { OsmNotesNewForm } from './OsmNotesNewForm'
import { NotesNewMap } from '../NotesNew/NotesNewMap'
import { useOsmNotesActions } from '../../../_hooks/mapStateInteraction/userMapNotes'
import {
  useNewOsmNoteMapParam,
  useShowOsmNotesParam,
} from '../../../_hooks/useQueryState/useNotesOsmParams'

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
  const { mapLoaded, mapBounds } = useMapStateInteraction()
  const { setOsmNotesFeatures } = useOsmNotesActions()
  const { showOsmNotesParam } = useShowOsmNotesParam()
  const { newOsmNoteMapParam, setNewOsmNoteMapParam } = useNewOsmNoteMapParam()
  const notesActiveByZoom = useNotesActiveByZoom()

  const bbox = mapBounds
    ?.toArray()
    ?.flat()
    ?.map((coord) => coord.toFixed(3))
    ?.join(',')
  const apiUrl = getOsmApiUrl(`/notes.json?bbox=${bbox}`)
  const { error, isLoading, isError } = useQuery({
    queryKey: ['osmNotes', bbox],
    queryFn: async () => {
      const response = await fetch(apiUrl, { headers: { Accept: 'application/json' } })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const featureCollection = await response.json()
      setOsmNotesFeatures(featureCollection)
      return featureCollection
    },
    enabled: mapLoaded && Boolean(bbox) && showOsmNotesParam && notesActiveByZoom,
  })

  if (isError) {
    console.error('Error when loading notes from', apiUrl, error)
  }

  return (
    <>
      <OsmNotesControls isLoading={isLoading} isError={isError} />
      <NotesNew
        visible={Boolean(newOsmNoteMapParam)}
        title="Einen Hinweis auf OpenStreetMap veröffentlichen"
      >
        <NotesNewMap
          mapId="newOsmNoteMap"
          newNoteMapParam={newOsmNoteMapParam}
          setNewNoteMapParam={setNewOsmNoteMapParam}
        />
        <OsmNotesNewForm />
      </NotesNew>
    </>
  )
}
