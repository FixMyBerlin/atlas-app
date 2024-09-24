import { TypedStyleLayer } from 'maplibre-gl'

export const layerVisibility = (visibile: boolean) => {
  return { visibility: visibile ? 'visible' : 'none' } satisfies Pick<TypedStyleLayer, 'visibility'>
}
