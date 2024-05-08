import { FeatureCollection, GeoJSON } from 'geojson'
import { MapGeoJSONFeature } from 'react-map-gl/maplibre'
import { create } from 'zustand'

export type Store = {
  geojson: GeoJSON | null
  features: MapGeoJSONFeature[] | undefined
  setGeojson: (geojson: Store['geojson']) => void
  setFeatures: (features: MapGeoJSONFeature[]) => void
  resetGeojson: () => void
}

export const useGeojsonStore = create<Store>((set, get) => ({
  geojson: null,
  features: undefined,
  setGeojson: (geojson) => set({ geojson }),
  setFeatures: (features) => set({ features }),
  resetGeojson: () => set({ geojson: null }),
}))
