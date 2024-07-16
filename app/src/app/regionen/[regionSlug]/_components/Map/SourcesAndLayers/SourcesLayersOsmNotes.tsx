import { Layer, Source } from 'react-map-gl/maplibre'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { useOsmNotesFeatures } from '../../../_hooks/mapStateInteraction/userMapNotes'
import { useShowOsmNotesParam } from '../../../_hooks/useQueryState/useNotesOsmParams'

export const osmNotesLayerId = 'osm-notes'

export const SourcesLayersOsmNotes = () => {
  const { showOsmNotesParam } = useShowOsmNotesParam()
  const { inspectorFeatures } = useMapStateInteraction()
  const osmNotesFeatures = useOsmNotesFeatures()

  const selectedFeatureIds = inspectorFeatures
    .filter((feature) => feature.source === 'osm-notes')
    .map((feature) => (feature?.properties?.id || 0) as number)

  return (
    <Source
      id="osm-notes"
      key="osm-notes"
      type="geojson"
      data={osmNotesFeatures}
      attribution="Notes: openstreetmap.org"
    >
      {showOsmNotesParam && (
        <>
          <Layer
            id="osm-notes-hover"
            key="osm-notes-hover"
            source="osm-notes"
            type="circle"
            paint={{
              'circle-radius': 12,
              'circle-color': '#f9a8d4', // pink-300 https://tailwindcss.com/docs/customizing-colors
            }}
            filter={['in', 'id', ...selectedFeatureIds]}
            // layout={{
            //   'circle-sort-key': [
            //     'case',
            //     ['in', ['get', 'id'], ['literal', selectedFeatureIds]],
            //     1,
            //     0,
            //   ],
            // }}
          />
          <Layer
            id={osmNotesLayerId}
            key="osm-notes"
            source="osm-notes"
            type="symbol"
            paint={{
              // See `useNotesActiveByZoom` about this opacity.
              // We will not load any data below a certain zoom level.
              // However, we want to still show what we loaded, so the context is preserved.
              'icon-opacity': ['step', ['zoom'], 0.3, 10, 1],
            }}
            layout={{
              visibility: 'visible',
              'icon-image': [
                'match',
                ['get', 'status'],
                // The sprites from Mapbox https://studio.mapbox.com/styles/hejco/cl706a84j003v14o23n2r81w7/edit/ => "sprites-fuer-atlas-notes-layer"
                'closed',
                'note-closed-osm' /* Checkmark */,
                'open',
                'note-open-osm' /* Questionmark */,
                'note-open-osm' /* fallback */,
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
