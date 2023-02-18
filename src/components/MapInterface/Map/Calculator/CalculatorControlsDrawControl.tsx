import MapboxDraw from '@mapbox/mapbox-gl-draw'
import React, { MutableRefObject } from 'react'
import { ControlPosition, MapRef, useControl } from 'react-map-gl'

export type DrawArea = Omit<
  GeoJSON.Feature<GeoJSON.Polygon, never | []>,
  'id'
> & {
  id: string
}

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  ref: MutableRefObject<MapboxDraw | undefined>
  position?: ControlPosition

  onCreate?: (event: { features: DrawArea[] }) => void
  onUpdate?: (event: { features: DrawArea[]; action: string }) => void
  onDelete?: (event: { features: DrawArea[] }) => void
}

// Docs https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#styling-draw
// Example https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/EXAMPLES.md#lines-and-polygons
// Style based on https://maplibre.org/maplibre-gl-js-docs/example/mapbox-gl-draw/
const drawControlStyle = [
  {
    id: 'gl-draw-polygon-fill-inactive',
    type: 'fill',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'fill-color': '#6d28d9',
      'fill-outline-color': '#6d28d9',
      'fill-opacity': 0.1,
    },
  },
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#a21caf',
      'fill-outline-color': '#a21caf',
      'fill-opacity': 0.1,
    },
  },
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': '#a21caf',
    },
  },
  {
    id: 'gl-draw-polygon-stroke-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#6d28d9',
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#a21caf',
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-line-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#6d28d9',
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-line-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#a21caf',
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'circle-radius': 5,
      'circle-color': '#fdf4ff',
    },
  },
  {
    id: 'gl-draw-polygon-and-line-vertex-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'circle-radius': 3,
      'circle-color': '#a21caf',
    },
  },
  {
    id: 'gl-draw-point-point-stroke-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': '#fdf4ff',
    },
  },
  {
    id: 'gl-draw-point-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'circle-radius': 3,
      'circle-color': '#6d28d9',
    },
  },
  {
    id: 'gl-draw-point-stroke-active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['!=', 'meta', 'midpoint'],
    ],
    paint: {
      'circle-radius': 8,
      'circle-color': '#fdf4ff',
    },
  },
  {
    id: 'gl-draw-point-active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true'],
    ],
    paint: {
      'circle-radius': 6,
      'circle-color': '#86198f',
    },
  },
  {
    id: 'gl-draw-polygon-fill-static',
    type: 'fill',
    filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': '#404040',
      'fill-outline-color': '#404040',
      'fill-opacity': 0.1,
    },
  },
  {
    id: 'gl-draw-polygon-stroke-static',
    type: 'line',
    filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#404040',
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-line-static',
    type: 'line',
    filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': '#404040',
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-point-static',
    type: 'circle',
    filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#404040',
    },
  },
]

// Thanks at https://github.com/visgl/react-map-gl/discussions/2053#discussioncomment-4225133
export const CalculatorControlsDrawControl = React.forwardRef<
  MapboxDraw | undefined,
  DrawControlProps
>((props: DrawControlProps, ref) => {
  const drawRef = useControl<MapboxDraw>(
    () => {
      // onCreate – MapboxDraw added to UI
      return new MapboxDraw({
        ...props,
        styles: drawControlStyle,
      })
    },
    ({ map }: { map: MapRef }) => {
      // onAdd – MapboxDraw initialized
      props.onCreate && map.on('draw.create', props.onCreate)
      props.onUpdate && map.on('draw.update', props.onUpdate)
      props.onDelete && map.on('draw.delete', props.onDelete)
      // https://github.com/visgl/react-map-gl/discussions/1770#discussioncomment-3546189
      map.on('load', function () {
        console.log('on map load')
        // const feature = {
        //   id: '12f1faa8806046dcf85b38b24c947ce8',
        //   type: 'Feature',
        //   properties: {},
        //   geometry: {
        //     coordinates: [
        //       [
        //         [13.36480529013457, 52.489579473177855],
        //         [13.363549060325226, 52.48956709574077],
        //         [13.363817381254904, 52.48917596693644],
        //         [13.36480529013457, 52.489579473177855],
        //       ],
        //     ],
        //     type: 'Polygon',
        //   },
        // }
        // drawRef.add(feature)
        // drawRef.changeMode('draw_line_string')
        console.log('all features', drawRef.getAll())
      })
    },
    ({ map }: { map: MapRef }) => {
      // onRemove – MapboxDraw removed to UI / cleanup
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
CalculatorControlsDrawControl.displayName = 'CalculatorControlsDrawControl'
