import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useOsmNotesParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useOsmNotesParam'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { OsmNotesControls } from './OsmNotesControls/OsmNotesControls'
import { OsmNotesNew } from './OsmNotesNew/OsmNotesNew'
import { useBoundsBbox } from './OsmNotesNew/utils/useBoundsBbox'
import { getOsmApiUrl } from 'src/app/_components/utils/getOsmUrl'

const osmNotesQueryClient = new QueryClient()

export const OsmNotes = () => {
  return (
    <QueryClientProvider client={osmNotesQueryClient}>
      <OsmNotesWrappedInQUeryClientProvider />
    </QueryClientProvider>
  )
}

const OsmNotesWrappedInQUeryClientProvider = () => {
  const { mapLoaded, setOsmNotesFeatures } = useMapStateInteraction()
  const { osmNotesParam: osmNotesActive } = useOsmNotesParam()

  const bbox = useBoundsBbox()
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
    enabled: mapLoaded && osmNotesActive,
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
