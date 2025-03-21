import { getOsmApiUrl } from '@/src/app/_components/utils/getOsmUrl'
import { useQuery } from '@tanstack/react-query'
import { featureCollection } from '@turf/turf'
import { useMapLoaded } from '../../../../_hooks/mapState/useMapState'
import { useOsmNotesActions } from '../../../../_hooks/mapState/userMapNotes'
import { useShowOsmNotesParam } from '../../../../_hooks/useQueryState/useNotesOsmParams'
import { useNotesActiveByZoom } from '../../utils/useNotesActiveByZoom'
import {
  osmApiFeatureCollectionSchema,
  OsmFeatureCollectionType,
  OsmFeaturePointType,
} from '../schema'
import { useBbox } from '../utils/useBbox'
import { useQueryKey } from '../utils/useQueryKey'

/** @desc This runs only once and puts the data into `src/app/regionen/[regionSlug]/_hooks/mapState/userMapNotes.ts` */
export const useLoadOsmNotes = () => {
  const mapLoaded = useMapLoaded()
  const { setOsmNotesFeatures } = useOsmNotesActions()
  const { showOsmNotesParam } = useShowOsmNotesParam()
  const notesActiveByZoom = useNotesActiveByZoom()

  const bbox = useBbox()
  const queryKey = useQueryKey()
  const apiUrl = getOsmApiUrl(`/notes.json?bbox=${bbox}`)
  const { error, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(apiUrl, { headers: { Accept: 'application/json' } })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const rawJson = await response.json()
      const parsed = osmApiFeatureCollectionSchema.parse(rawJson)
      // Some of our features require a feature.id
      // In addition, we add a property to change the note icon (tilda notes vs. other)
      const searchTerms = ['#tilda', '#radverkehrsatlas']
      const featuresWithId: OsmFeaturePointType[] = parsed.features.map((feature) => {
        return {
          ...feature,
          id: feature.properties.id,
          properties: {
            ...feature.properties,
            tilda: feature.properties.comments.some((c) =>
              searchTerms.some((term) => c.text && c.text.toLocaleLowerCase().includes(term)),
            ),
          },
        }
      })
      // @ts-expect-error turf.featureCollection has an option `id` but we are sure it is there. But this causes a type missmatch.
      const result: OsmFeatureCollectionType = featureCollection(featuresWithId)
      setOsmNotesFeatures(result)
      return result
    },
    enabled: mapLoaded && Boolean(bbox) && showOsmNotesParam && notesActiveByZoom,
  })

  if (isError) {
    console.error('Error when loading notes from', apiUrl, error)
  }

  return { isLoading, isError }
}
