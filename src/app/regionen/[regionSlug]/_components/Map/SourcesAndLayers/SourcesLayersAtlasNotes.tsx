import { useQuery } from '@blitzjs/rpc'
import { Layer, Source } from 'react-map-gl/maplibre'
import getNotesAndCommentsForRegion from 'src/notes/queries/getNotesAndCommentsForRegion'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { useShowAtlasNotesParam } from '../../../_hooks/useQueryState/useNotesAtlasParams'
import { useStaticRegion } from '../../regionUtils/useStaticRegion'

export const atlasNotesLayerId = 'atlas-notes'

export const SourcesLayersAtlasNotes = () => {
  const { showAtlasNotesParam } = useShowAtlasNotesParam()
  const { inspectorFeatures } = useMapStateInteraction()
  const region = useStaticRegion()!

  // For now, we load all notes, but minimized data. We will want to scope this to the viewport later.
  const [notes] = useQuery(
    getNotesAndCommentsForRegion,
    { regionSlug: region.slug },
    { enabled: region.notes !== 'atlasNotes' },
  )

  const selectedFeatureIds = inspectorFeatures
    .filter((feature) => feature.source === 'atlas-notes')
    .map((feature) => (feature?.properties?.id || 0) as number)

  if (region.notes !== 'atlasNotes') return null

  return (
    <Source
      id="atlas-notes"
      key="atlas-notes"
      type="geojson"
      data={notes}
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
              'circle-radius': 15,
              'circle-color': '#b45309', // amber-700 https://tailwindcss.com/docs/customizing-colors
              'circle-opacity': ['step', ['zoom'], 0.3, 10, 0.6],
              'circle-blur': 0.3,
            }}
            filter={['in', 'id', ...selectedFeatureIds]}
          />
          <Layer
            // The PNGs are transparent so we add this background
            id="atlas-notes-background"
            key="atlas-notes-background"
            source="atlas-notes"
            type="circle"
            paint={{
              'circle-radius': 11,
              'circle-color': '#fbbf24', // amber-400 https://tailwindcss.com/docs/customizing-colors
              'circle-opacity': ['step', ['zoom'], 0.3, 10, 1],
            }}
          />
          <Layer
            id={atlasNotesLayerId}
            key="atlas-notes"
            source="atlas-notes"
            type="symbol"
            paint={{
              'icon-opacity': ['step', ['zoom'], 0.3, 10, 1],
            }}
            layout={{
              visibility: 'visible',
              'icon-image': [
                'match',
                ['get', 'status'],
                // The sprites in Mapbox are mixed up
                // https://studio.mapbox.com/styles/hejco/cl706a84j003v14o23n2r81w7/edit/ => "sprites-fuer-atlas-notes-layer"
                // notes_open is the resolved
                'closed' /* status=closed */,
                'notes_open',
                'open' /* status=open */,
                'notes_closed',
                'notes_closed' /* default */,
              ],
              'icon-size': 0.85,
              'icon-allow-overlap': true,
            }}
          />
        </>
      )}
    </Source>
  )
}
