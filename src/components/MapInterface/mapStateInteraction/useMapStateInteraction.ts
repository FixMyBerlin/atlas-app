import { VerificationApiGet } from '@api/index'
import { isDev } from '@components/utils/isEnv'
import { MapboxGeoJSONFeature } from 'react-map-gl'
import { create } from 'zustand'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

type Store = StoreMapState &
  StoreDebugInfo &
  StoreFeaturesInspector &
  StoreCalculator &
  StoreLocalUpdates

type StoreMapState = {
  mapLoaded: boolean
  setMapLoaded: (mapLoaded: StoreMapState['mapLoaded']) => void
}

type StoreDebugInfo = {
  showDebugInfo: boolean
  setShowDebugInfo: (showDebugInfo: StoreDebugInfo['showDebugInfo']) => void
}

export type StoreFeaturesInspector = {
  inspectorFeatures: MapboxGeoJSONFeature[]
  setInspector: (
    inspectObject: StoreFeaturesInspector['inspectorFeatures']
  ) => void
  resetInspector: () => void
}

export type StoreCalculator = {
  calculatorAreasWithFeatures: {
    key: string
    features: MapboxGeoJSONFeature[]
  }[]
  setCalculatorAreasWithFeatures: (
    calculatorAreasWithFeatures: StoreCalculator['calculatorAreasWithFeatures']
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

  showDebugInfo: isDev,
  setShowDebugInfo: (showDebugInfo) => set({ showDebugInfo }),

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
