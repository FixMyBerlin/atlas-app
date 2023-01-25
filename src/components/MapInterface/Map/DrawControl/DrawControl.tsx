import { ControlPosition, MapRef, useControl } from 'react-map-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import type { Polygon } from '@turf/turf'

export type DrawFeature = {
  id: string
  type: 'Feature'
  geometry: Polygon
  properties: never
}

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition

  onCreate?: (event: { features: DrawFeature[] }) => void
  onUpdate?: (event: { features: DrawFeature[]; action: string }) => void
  onDelete?: (event: { features: DrawFeature[] }) => void
}

export const DrawControl = (props: DrawControlProps) => {
  useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    ({ map }: { map: MapRef }) => {
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

  return null
}
