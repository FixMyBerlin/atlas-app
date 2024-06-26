import { isEqual } from 'lodash'
import { LngLatBounds } from 'maplibre-gl'
import { MapGeoJSONFeature } from 'react-map-gl/maplibre'
import { TCreateVerificationSchema } from 'src/bikelane-verifications/schemas'
import { create } from 'zustand'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

export type Store = StoreMapLoadedState &
  StoreMapDataLoadingState &
  StoreFeaturesInspector &
  StoreCalculator &
  StoreLocalUpdates &
  StoreSizes

type StoreMapLoadedState = {
  mapLoaded: boolean
  setMapLoaded: (mapLoaded: Store['mapLoaded']) => void
}

type StoreMapDataLoadingState = {
  mapDataLoading: boolean
  setMapDataLoading: (mapDataLoading: Store['mapDataLoading']) => void
}

type StoreSizes = {
  mapBounds: LngLatBounds | null
  setMapBounds: (mapBounds: Store['mapBounds']) => void
  inspectorSize: { width: number; height: number }
  setInspectorSize: (inspectorSize: Store['inspectorSize']) => void
  sidebarLayerControlsSize: { width: number; height: number }
  setSidebarLayerControlsSize: (sidebarLayerControlsSize: Store['sidebarLayerControlsSize']) => void
}

export type StoreFeaturesInspector = {
  // https://visgl.github.io/react-map-gl/docs/api-reference/types#mapgeojsonfeature
  inspectorFeatures: MapGeoJSONFeature[]
  setInspectorFeatures: (inspectObject: Store['inspectorFeatures']) => void
  resetInspectorFeatures: () => void
}

export type StoreCalculator = {
  calculatorAreasWithFeatures: {
    key: string
    features: MapGeoJSONFeature[]
  }[]
  setCalculatorAreasWithFeatures: (
    calculatorAreasWithFeatures: Store['calculatorAreasWithFeatures'],
  ) => void
}

type StoreLocalUpdates = {
  localUpdates: Omit<TCreateVerificationSchema, 'id'>[]
  addLocalUpdate: (id: Omit<TCreateVerificationSchema, 'id'>) => void
}

function setIfChanged(get, set, name, value) {
  if (isEqual(get()[name], value)) return
  set({ [name]: value })
}

export const useMapStateInteraction = create<Store>((set, get) => {
  return {
    // Guards againt errors when using `mainMap?.getStyle`
    mapLoaded: false,
    setMapLoaded: (mapLoaded) => set({ mapLoaded }),

    // Toggels <LoadingIndicator>
    mapDataLoading: false,
    setMapDataLoading: (mapDataLoading) => set({ mapDataLoading }),

    // Data for <Inspector> AND <LayerHighlight>
    inspectorFeatures: [],
    setInspectorFeatures: (inspectorFeatures) => set({ inspectorFeatures }),
    resetInspectorFeatures: () => set({ inspectorFeatures: [] }),

    // Data for <Inspector> AND <LayerHighlight>
    calculatorAreasWithFeatures: [],
    setCalculatorAreasWithFeatures: (calculatorAreasWithFeatures) =>
      set({ calculatorAreasWithFeatures }),

    // Data for optimistic updates; show verification immediately <LayerHightlight>
    localUpdates: [],
    addLocalUpdate: (update) => {
      const { localUpdates } = get()
      set({
        localUpdates: [...localUpdates, update],
      })
    },

    mapBounds: null,
    setMapBounds: (bounds) => set({ mapBounds: bounds }),

    inspectorSize: { width: 0, height: 0 },
    setInspectorSize: (size) => setIfChanged(get, set, 'inspectorSize', size),

    sidebarLayerControlsSize: { width: 0, height: 0 },
    setSidebarLayerControlsSize: (size) => {
      setIfChanged(get, set, 'sidebarLayerControlsSize', size)
    },
  }
})
