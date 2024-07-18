import { create } from 'zustand'
import { GeoJSON } from 'geojson'

export type Store = {
  geojson: GeoJSON | null
  actions: {
    setGeojson: (mapBounds: Store['geojson']) => void
    resetGeojson: () => void
  }
}

export const useGeojsonState = create<Store>((set, get) => ({
  geojson: null,
  setGeojson: (geojson) => set({ geojson }),
  resetGeojson: () => set({ geojson: null }),
  actions: {
    setGeojson: (geojson) => set({ geojson }),
    resetGeojson: () => set({ geojson: null }),
  },
}))

export const useGeojsonData = () => useGeojsonState((state) => state.geojson)
export const useGeojsonActions = () => useGeojsonState((state) => state.actions)
