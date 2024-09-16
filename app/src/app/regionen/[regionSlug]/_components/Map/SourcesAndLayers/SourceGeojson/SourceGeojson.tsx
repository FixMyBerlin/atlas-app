import { Layer, Source } from 'react-map-gl/maplibre'
import { useGeojsonData } from './useGeojsonState'

// very useful for debugging geometry:
// const { setGeojson, resetGeojson } = useGeojsonActions()
// setGeojson(geojsonData)

export const SourceGeojson = () => {
  const geojson = useGeojsonData()
  if (!geojson) return null

  return (
    <Source id="debug" type="geojson" data={geojson}>
      <Layer
        id="lineLayer"
        type="line"
        source="debug"
        paint={{
          'line-color': 'red',
          'line-width': 5,
        }}
      />
    </Source>
  )
}
