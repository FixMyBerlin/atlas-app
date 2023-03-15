import { VerificationApiGet } from '@api/index'
import { MapboxGeoJSONFeature } from 'react-map-gl'
import { create } from 'zustand'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

type Store = StoreMapState & StoreFeaturesInspector & StoreCalculator & StoreLocalUpdates

type StoreMapState = {
  mapLoaded: boolean
  setMapLoaded: (mapLoaded: Store['mapLoaded']) => void
}

export type StoreFeaturesInspector = {
  inspectorFeatures: MapboxGeoJSONFeature[]
  setInspector: (inspectObject: Store['inspectorFeatures']) => void
  resetInspector: () => void
}

export type StoreCalculator = {
  calculatorAreasWithFeatures: {
    key: string
    features: MapboxGeoJSONFeature[]
  }[]
  setCalculatorAreasWithFeatures: (
    calculatorAreasWithFeatures: Store['calculatorAreasWithFeatures']
  ) => void
}

type StoreLocalUpdates = {
  localUpdates: VerificationApiGet[]
  addLocalUpdate: (update: VerificationApiGet) => void
  removeLocalUpdate: (update: VerificationApiGet) => void
}

export const useMapStateInteraction = create<Store>((set, get) => ({
  mapLoaded: false,
  setMapLoaded: (mapLoaded) => set({ mapLoaded }),

  // Data for <Inspector> AND <LayerHighlight>
  inspectorFeatures: [],
  setInspector: (inspectorFeatures) => set({ inspectorFeatures }),
  resetInspector: () => set({ inspectorFeatures: [] }),

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
  removeLocalUpdate: (updateToRemove) => {
    const { localUpdates } = get()
    set({
      localUpdates: localUpdates.filter((update) => update === updateToRemove),
    })
  },
}))
