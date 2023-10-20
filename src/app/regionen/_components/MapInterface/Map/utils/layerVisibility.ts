import mapboxgl from 'mapbox-gl'

export const layerVisibility = (visibile: boolean) => {
  return { visibility: visibile ? 'visible' : 'none' } as mapboxgl.Layout
}
