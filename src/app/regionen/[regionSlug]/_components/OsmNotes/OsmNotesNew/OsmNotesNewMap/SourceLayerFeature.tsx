import * as turf from '@turf/turf'
import { Layer, Source } from 'react-map-gl/maplibre'
import { useMapStateInteraction } from 'src/app/regionen/[regionSlug]/_hooks/mapStateInteraction/useMapStateInteraction'

export const SourceLayerFeature = () => {
  const { osmNewNoteFeature } = useMapStateInteraction()
  if (!osmNewNoteFeature) return null

  return (
    <Source
      id="geometry_from_inspector"
      type="geojson"
      data={turf.featureCollection([osmNewNoteFeature])}
    >
      <Layer
        id="osm_notes_new_map_geometry_area"
        type="fill"
        paint={{
          'fill-color': '#14b8a6',
          'fill-outline-color': '#0f766e',
          'fill-opacity': 0.3,
        }}
        filter={['==', '$type', 'Polygon']}
      />
      <Layer
        id="osm_notes_new_map_geometry_point"
        type="circle"
        paint={{
          'circle-radius': 8,
          'circle-color': '#0f766e',
          'circle-opacity': 0.6,
        }}
        filter={['==', '$type', 'Point']}
      />
      <Layer
        id="osm_notes_new_map_geometry_line"
        type="line"
        paint={{
          'line-width': 12,
          'line-color': '#14b8a6',
          'line-opacity': 0.6,
        }}
        filter={['==', '$type', 'LineString']}
      />
    </Source>
  )
}
