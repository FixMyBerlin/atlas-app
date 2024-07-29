import { useQuery } from '@blitzjs/rpc'
import { Layer, Source } from 'react-map-gl/maplibre'
import getNotesAndCommentsForRegion from 'src/notes/queries/getNotesAndCommentsForRegion'
import { useMapInspectorFeatures } from '../../../_hooks/mapState/useMapState'
import {
  useAtlasFilterParam,
  useShowAtlasNotesParam,
} from '../../../_hooks/useQueryState/useNotesAtlasParams'
import { useAllowAtlasNotes } from '../../notes/AtlasNotes/utils/useAllowAtlasNotes'
import { useStaticRegion } from '../../regionUtils/useStaticRegion'

export const atlasNotesLayerId = 'atlas-notes'

export const SourcesLayersAtlasNotes = () => {
  const { showAtlasNotesParam } = useShowAtlasNotesParam()
  const region = useStaticRegion()!
  const allowAtlasNotes = useAllowAtlasNotes()
  const inspectorFeatures = useMapInspectorFeatures()

  const { atlasNotesFilterParam } = useAtlasFilterParam()

  // For now, we load all notes, but minimized data. We will want to scope this to the viewport later.
  const [result] = useQuery(
    getNotesAndCommentsForRegion,
    { regionSlug: region.slug, filter: atlasNotesFilterParam },
    { enabled: allowAtlasNotes },
  )
  if (result === undefined) return null
  if (!allowAtlasNotes) return null

  const selectedFeatureIds = inspectorFeatures
    .filter((feature) => feature.source === 'atlas-notes')
    .map((feature) => (feature?.properties?.id || 0) as number)

  return (
    <Source
      id="atlas-notes"
      key="atlas-notes"
      type="geojson"
      data={result.featureCollection}
      // attribution="" Internal data / copyrighted
    >
      {showAtlasNotesParam && (
        <>
          <Layer
            id="atlas-notes-hover"
            key="atlas-notes-hover"
            source="atlas-notes"
            type="circle"
            paint={{
              'circle-radius': 12,
              'circle-color': '#f9a8d4', // pink-300 https://tailwindcss.com/docs/customizing-colors
            }}
            filter={['in', 'id', ...selectedFeatureIds]}
          />
          <Layer
            id={atlasNotesLayerId}
            key="atlas-notes"
            source="atlas-notes"
            type="symbol"
            layout={{
              visibility: 'visible',
              'icon-image': [
                'match',
                ['get', 'status'],
                // The sprites from Mapbox https://studio.mapbox.com/styles/hejco/cl706a84j003v14o23n2r81w7/edit/ => "sprites-fuer-atlas-notes-layer"
                'closed',
                'note-closed-intern' /* Checkmark */,
                'open',
                'note-open-intern' /* Questionmark */,
                'note-open-intern' /* fallback */,
              ],
              'icon-size': ['interpolate', ['linear'], ['zoom'], 0, 0.3, 10, 0.5, 22, 0.5],
              'icon-allow-overlap': true,
            }}
          />
        </>
      )}
    </Source>
  )
}
