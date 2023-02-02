import MapboxDraw from '@mapbox/mapbox-gl-draw'
import type { Polygon } from '@turf/turf'
import React, { MutableRefObject } from 'react'
import { ControlPosition, MapRef, useControl } from 'react-map-gl'

export type DrawFeature = {
  id: string
  type: 'Feature'
  geometry: Polygon
  properties: never
}

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  drawRef: MutableRefObject<MapboxDraw | undefined>
  position?: ControlPosition

  onCreate?: (event: { features: DrawFeature[] }) => void
  onUpdate?: (event: { features: DrawFeature[]; action: string }) => void
  onDelete?: (event: { features: DrawFeature[] }) => void
}

// Docs https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#styling-draw
// Example https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/EXAMPLES.md#lines-and-polygons
const drawControlStyle = [
  // ACTIVE (being drawn)
  // line stroke
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#D20C0C',
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
  // polygon fill
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#D20C0C',
      'fill-outline-color': '#D20C0C',
      'fill-opacity': 0.1,
    },
  },
  // polygon mid points; the handle to add another corner to a side
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': '#fbb03b',
    },
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#D20C0C',
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
  // vertex point halos
  {
    id: 'gl-draw-polygon-and-line-vertex-halo-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#FFF',
    },
  },
  // vertex points
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 3,
      'circle-color': '#D20C0C',
    },
  },
]

export const DrawControl = React.forwardRef((props: DrawControlProps, ref) => {
  const drawRef = useControl<MapboxDraw>(
    () => {
      return new MapboxDraw({
        ...props,
        styles: drawControlStyle,
      })
    },
    ({ map }: { map: MapRef }) => {
      console.log('x', { map, drawRef })
      props.onCreate && map.on('draw.create', props.onCreate)
      props.onUpdate && map.on('draw.update', props.onUpdate)
      props.onDelete && map.on('draw.delete', props.onDelete)
    },
    ({ map }: { map: MapRef }) => {
      props.onCreate && map.off('draw.create', props.onCreate)
      props.onUpdate && map.off('draw.update', props.onUpdate)
      props.onDelete && map.off('draw.delete', props.onDelete)
    },
    {
      position: props.position,
    }
  )

  React.useImperativeHandle(ref, () => drawRef, [drawRef]) // This way I exposed drawRef outside the component

  return null
})
DrawControl.displayName = 'DrawControl'
