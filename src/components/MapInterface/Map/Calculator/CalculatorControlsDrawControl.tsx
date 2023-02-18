import MapboxDraw from '@mapbox/mapbox-gl-draw'
import React, { MutableRefObject } from 'react'
import { ControlPosition, MapRef, useControl } from 'react-map-gl'
import { drawControlStyle } from './drawControlStyle'

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
