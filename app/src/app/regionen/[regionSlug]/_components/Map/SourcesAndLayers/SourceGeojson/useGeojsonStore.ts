import { create } from 'zustand'
import { GeoJSON } from 'geojson'

export type Store = {
  geojson: GeoJSON | null
  setGeojson: (mapBounds: Store['geojson']) => void
  resetGeojson: () => void
}

export const useGeojsonStore = create<Store>((set, get) => ({
  geojson: null,
  setGeojson: (geojson) => set({ geojson }),
  resetGeojson: () => set({ geojson: null }),
}))
