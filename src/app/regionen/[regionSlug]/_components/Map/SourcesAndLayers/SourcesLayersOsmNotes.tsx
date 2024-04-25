import { Layer, Source } from 'react-map-gl/maplibre'
import { useOsmNotesParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useOsmNotesParam'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'

export const osmNotesLayerId = 'osm-notes'

export const SourcesLayersOsmNotes: React.FC = () => {
  const { osmNotesParam: osmNotesActive } = useOsmNotesParam()
  const { osmNotesFeatures, inspectorFeatures } = useMapStateInteraction()

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
      {osmNotesActive && (
        <>
          <Layer
            id="osm-notes-hover"
            key="osm-notes-hover"
            source="osm-notes"
            type="circle"
            paint={{
              'circle-radius': 15,
              'circle-color': '#115e59', // teal-800 https://tailwindcss.com/docs/customizing-colors
              'circle-opacity': 0.6,
              'circle-blur': 0.3,
            }}
            filter={['in', 'id', ...selectedFeatureIds]}
          />
          <Layer
            // The PNGs are transparent so we add this background
            id="osm-notes-background"
            key="osm-notes-background"
            source="osm-notes"
            type="circle"
            paint={{
              'circle-radius': 11,
              'circle-color': 'white',
            }}
          />
          <Layer
            id={osmNotesLayerId}
            key="osm-notes"
            source="osm-notes"
            type="symbol"
            layout={{
              visibility: 'visible',
              'icon-image': [
                'match',
                ['get', 'status'],
                'closed' /* status=closed */,
                'notes_closed',
                'open' /* status=open */,
                'notes_open',
                'notes_open' /* default */,
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
