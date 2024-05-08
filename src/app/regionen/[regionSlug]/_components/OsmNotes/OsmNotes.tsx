import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getOsmApiUrl } from 'src/app/_components/utils/getOsmUrl'
import { useOsmNotesParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useOsmNotesParam'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { OsmNotesControls } from './OsmNotesControls/OsmNotesControls'
import { OsmNotesNew } from './OsmNotesNew/OsmNotesNew'
import { useNotesActiveByZoom } from './OsmNotesNew/utils/useNotesActiveByZoom'

const osmNotesQueryClient = new QueryClient()

export const OsmNotes = () => {
  return (
    <QueryClientProvider client={osmNotesQueryClient}>
      <OsmNotesWrappedInQUeryClientProvider />
    </QueryClientProvider>
  )
}

const OsmNotesWrappedInQUeryClientProvider = () => {
  const { mapLoaded, mapBounds, setOsmNotesFeatures } = useMapStateInteraction()
  const { osmNotesParam: osmNotesActive } = useOsmNotesParam()
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
    enabled: mapLoaded && Boolean(bbox) && osmNotesActive && notesActiveByZoom,
  })

  if (isError) {
    console.error('Error when loading notes from', apiUrl, error)
  }

  return (
    <>
      <OsmNotesControls isLoading={isLoading} isError={isError} />
      <OsmNotesNew />
    </>
  )
}
