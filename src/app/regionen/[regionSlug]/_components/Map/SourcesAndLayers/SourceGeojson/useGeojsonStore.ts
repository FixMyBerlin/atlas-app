import { featureCollection } from '@turf/turf'
import { FeatureCollection, GeoJSON } from 'geojson'
import { MapGeoJSONFeature } from 'react-map-gl/maplibre'
import { create } from 'zustand'

export type Store = {
  geojson: GeoJSON | null
  lineFeatures: FeatureCollection
  circleFeatures: FeatureCollection
  fillFeatures: FeatureCollection
  setGeojson: (geojson: Store['geojson']) => void
  setFeatures: (features: MapGeoJSONFeature[]) => void
  resetGeojson: () => void
}

export const useGeojsonStore = create<Store>((set, get) => ({
  geojson: null,
  lineFeatures: featureCollection([]),
  circleFeatures: featureCollection([]),
  fillFeatures: featureCollection([]),
  setGeojson: (geojson) => set({ geojson }),
  setFeatures: (features) => {
    const lineFeatures = featureCollection(
      features
        .filter((f) => f.layer.type === 'line')
        .map(({ type, geometry }) => ({ type, properties: {}, geometry })),
    )
    const circleFeatures = featureCollection(
      features
        .filter((f) => f.layer.type === 'circle')
        .map(({ type, geometry }) => ({ type, properties: {}, geometry })),
    )
    const fillFeatures = featureCollection(
      features
        .filter((f) => f.layer.type === 'fill')
        .map(({ type, geometry }) => ({ type, properties: {}, geometry })),
    )
    set({ lineFeatures, circleFeatures, fillFeatures })
  },
  resetGeojson: () => set({ geojson: null }),
}))
