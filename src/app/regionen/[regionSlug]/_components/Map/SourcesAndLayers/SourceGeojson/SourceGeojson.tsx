import React, { memo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { Store, useGeojsonStore } from './useGeojsonStore'

type Props = Pick<Store, 'geojson'>

// very useful for debugging geometry:
// const { setGeojson, resetGeojson } = useGeojsonStore()
// setGeojson(geojsonData)
const SourceGeojsonMemoized = memo(function SourceGeojsonMemoized(props: Props) {
  const { geojson } = props
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
})

export const SourceGeojson: React.FC = () => {
  const { geojson } = useGeojsonStore()
  const props = { geojson }
  return <SourceGeojsonMemoized {...props} />
}
