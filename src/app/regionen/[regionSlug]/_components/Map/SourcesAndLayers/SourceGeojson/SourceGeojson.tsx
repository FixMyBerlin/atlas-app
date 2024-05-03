import React, { memo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { Store, useGeojsonStore } from './useGeojsonStore'

type Props = Pick<Store, 'geojson' | 'lineFeatures' | 'circleFeatures' | 'fillFeatures'>

const SourceGeojsonMemoized = memo(function SourceGeojsonMemoized(props: Props) {
  const { lineFeatures, circleFeatures, fillFeatures } = props

  return (
    <>
      <Source id="highlights--line" type="geojson" data={lineFeatures}>
        <Layer
          id="highlights--line"
          type="line"
          source="highlights--line"
          paint={{
            'line-color': 'orange',
            'line-width': 10,
          }}
        />
      </Source>
      <Source id="highlights--circle" type="geojson" data={circleFeatures}>
        <Layer
          id="highlights--circle"
          type="circle"
          source="highlights--circle"
          paint={{
            'circle-radius': 10,
            'circle-color': 'orange',
            'circle-stroke-color': 'black',
            'circle-stroke-width': 2,
          }}
        />
      </Source>
      <Source id="highlights--fill" type="geojson" data={fillFeatures}>
        <Layer
          id="highlights--fill"
          type="fill"
          source="highlights--fill"
          paint={{
            'fill-color': 'orange',
            'fill-opacity': 0.8,
          }}
        />
      </Source>
    </>
  )
})

export const SourceGeojson: React.FC = () => {
  const { geojson, lineFeatures, circleFeatures, fillFeatures } = useGeojsonStore()
  const props = { geojson, lineFeatures, circleFeatures, fillFeatures }
  return <SourceGeojsonMemoized {...props} />
}
