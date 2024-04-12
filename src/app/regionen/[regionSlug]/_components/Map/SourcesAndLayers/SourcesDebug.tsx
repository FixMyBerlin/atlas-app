import React, { memo } from 'react'
import { Layer, Source, useMap } from 'react-map-gl/maplibre'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { Feature, featureCollection } from '@turf/turf'
import { createBoundingPolygon } from '../../SidebarInspector/util'

const SourcesDebugMemoized = memo(function SourcesDebugToMemoize({
  mainMap,
  mapBounds,
  inspectorSize,
  sidebarLayerControlsSize,
}) {
  let boundingPolygon: Feature | null = null
  if (mainMap && inspectorSize && sidebarLayerControlsSize) {
    boundingPolygon = createBoundingPolygon(mainMap, sidebarLayerControlsSize, inspectorSize)
  }

  if (!boundingPolygon) return null

  const data = featureCollection([boundingPolygon])

  if (!data) return null

  return (
    <Source id="debug" type="geojson" data={data}>
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

export const SourcesDebug: React.FC = () => {
  const { mapBounds, inspectorSize, sidebarLayerControlsSize } = useMapStateInteraction()
  // mapBounds is unused but needed to rerender on map changes
  const { mainMap } = useMap()
  const props = { mainMap, mapBounds, inspectorSize, sidebarLayerControlsSize }
  return <SourcesDebugMemoized {...props} />
}
