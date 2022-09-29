import { MapboxGeoJSONFeature } from 'react-map-gl'
import create from 'zustand'
import { MapDataConfigTopic } from '../Map/mapData'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

export type StoreMap = StateInitialization &
  StoreInteractiveLayer &
  StoreFeaturesInspector &
  StoreFeaturesCalculator

type StateInitialization = {
  initialized: boolean
  setInitialized: (initizalized: true) => void
}

type StoreInteractiveLayer = {
  interactiveLayerIds: string[] | []
  addInteractiveLayerIds: (layerIdsToAdd: string[]) => void
  removeInteractiveLayerIds: (layerIdsToRemove: string[]) => void
}

type StoreFeaturesInspector = {
  inspectorFeatures: null | MapboxGeoJSONFeature[]
  setInspector: (
    inspectObject: StoreFeaturesInspector['inspectorFeatures']
  ) => void
}

type StoreFeaturesCalculator = {
  calculatorFeatures: [] | MapboxGeoJSONFeature[]
  addToCalculator: (featuresToAdd: MapboxGeoJSONFeature[]) => void
  removeFromCalculator: (featureToRemove: MapboxGeoJSONFeature) => void
  clearCalculator: () => void
}

export const useStoreMap = create<StoreMap>((set, get) => ({
  initialized: false,
  setInitialized: (initialized) => set({ initialized }),

  interactiveLayerIds: [],
  addInteractiveLayerIds: (layerIdsToAdd) => {
    const { interactiveLayerIds } = get()
    // TODO use uniqueArray
    set({
      interactiveLayerIds: Array.from(
        new Set([...layerIdsToAdd, ...interactiveLayerIds])
      ),
    })
  },
  removeInteractiveLayerIds: (layerIdsToRemove) => {
    const { interactiveLayerIds } = get()
    set({
      interactiveLayerIds: interactiveLayerIds.filter(
        (id) => !layerIdsToRemove.includes(id)
      ),
    })
  },

  inspectorFeatures: [],
  setInspector: (inspectorFeatures) => set({ inspectorFeatures }),

  calculatorFeatures: [],
  addToCalculator: (featuresToAdd) => {
    const featuresWithCapacity = featuresToAdd.filter(
      (f) => f?.properties?.capacity
    )
    const { calculatorFeatures } = get()
    // Make array unique `Array.from(new Set[/* non-unique array */]))` https://stackoverflow.com/a/9229821/729221
    // TODO use uniqueArray
    set({
      calculatorFeatures: Array.from(
        new Set([...featuresWithCapacity, ...calculatorFeatures])
      ),
    })
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
}))
