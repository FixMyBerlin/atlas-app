import { VerificationApiGet } from '@api/index'
import { uniqueGeoJSONFeatureArray } from '@components/utils'
import { isDev } from '@components/utils/isEnv'
import { MapboxGeoJSONFeature } from 'react-map-gl'
import create from 'zustand'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

type Store = StoreDebugInfo &
  StoreFeaturesInspector &
  StoreFeaturesCalculator &
  StoreLocalUpdates

type StoreDebugInfo = {
  showDebugInfo: boolean
  setShowDebugInfo: (showDebugInfo: boolean) => void
}

type StoreFeaturesInspector = {
  inspectorFeatures: MapboxGeoJSONFeature[]
  setInspector: (
    inspectObject: StoreFeaturesInspector['inspectorFeatures']
  ) => void
  resetInspector: () => void
}

type StoreFeaturesCalculator = {
  calculatorFeatures: [] | MapboxGeoJSONFeature[]
  addToCalculator: (featuresToAdd: MapboxGeoJSONFeature[]) => void
  removeFromCalculator: (featureToRemove: MapboxGeoJSONFeature) => void
  clearCalculator: () => void
}

type StoreLocalUpdates = {
  localUpdates: VerificationApiGet[]
  addLocalUpdate: (update: VerificationApiGet) => void
  removeLocalUpdate: (update: VerificationApiGet) => void
}

export const useMapStateInteraction = create<Store>((set, get) => ({
  showDebugInfo: isDev,
  setShowDebugInfo: (showDebugInfo) => set({ showDebugInfo: showDebugInfo }),

  inspectorFeatures: [],
  setInspector: (inspectorFeatures) => set({ inspectorFeatures }),
  resetInspector: () => set({ inspectorFeatures: [] }),

  calculatorFeatures: [],
  addToCalculator: (featuresToAdd) => {
    const featuresWithCapacity = featuresToAdd.filter(
      (f) => f?.properties?.capacity
    )
    const { calculatorFeatures } = get()
    const uniqueFeatures = uniqueGeoJSONFeatureArray(
      calculatorFeatures,
      featuresWithCapacity
    )
    set({ calculatorFeatures: uniqueFeatures })
  },
  removeFromCalculator: (featureToRemove) => {
    const { calculatorFeatures } = get()
    set({
      calculatorFeatures: calculatorFeatures.filter(
        (s) => s?.properties?.id !== featureToRemove?.properties?.id
      ),
    })
  },
  clearCalculator: () => {
    set({ calculatorFeatures: [] })
  },

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
