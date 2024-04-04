import { MapGeoJSONFeature, MapboxGeoJSONFeature } from 'react-map-gl'
import { TCreateVerificationSchema } from 'src/bikelane-verifications/schemas'
import { create } from 'zustand'
import { createInspectorFeatureKey } from '../../_components/utils/sourceKeyUtils/createInspectorFeatureKey'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

type Store = StoreMapLoadedState &
  StoreMapDataLoadingState &
  StoreFeaturesInspector &
  StoreCalculator &
  StoreLocalUpdates &
  StoreOsmNotesState

type StoreMapLoadedState = {
  mapLoaded: boolean
  setMapLoaded: (mapLoaded: Store['mapLoaded']) => void
}

type StoreMapDataLoadingState = {
  mapDataLoading: boolean
  setMapDataLoading: (mapDataLoading: Store['mapDataLoading']) => void
}

type StoreOsmNotesState = {
  osmNotesLoading: boolean
  setOsmNotesLoading: (osmNotesLoaded: Store['osmNotesLoading']) => void
  osmNotesError: boolean
  setOsmNotesError: (osmNotesError: Store['osmNotesError']) => void
}

export type StoreFeaturesInspector = {
  // https://visgl.github.io/react-map-gl/docs/api-reference/types#mapgeojsonfeature
  unfilteredInspectorFeatures: MapGeoJSONFeature[]
  getUniqueInspectorFeatures: () => MapGeoJSONFeature[]
  setInspectorFeatures: (inspectObject: Store['unfilteredInspectorFeatures']) => void
  resetInspectorFeatures: () => void
}

export type StoreCalculator = {
  calculatorAreasWithFeatures: {
    key: string
    features: MapboxGeoJSONFeature[]
  }[]
  setCalculatorAreasWithFeatures: (
    calculatorAreasWithFeatures: Store['calculatorAreasWithFeatures'],
  ) => void
}

type StoreLocalUpdates = {
  localUpdates: Omit<TCreateVerificationSchema, 'id'>[]
  addLocalUpdate: (id: Omit<TCreateVerificationSchema, 'id'>) => void
}

export const useMapStateInteraction = create<Store>((set, get) => ({
  mapLoaded: false,
  setMapLoaded: (mapLoaded) => set({ mapLoaded }),

  mapDataLoading: false,
  setMapDataLoading: (mapDataLoading) => set({ mapDataLoading }),

  // We store this globally to separate the fetching from the UI logic
  osmNotesLoading: false,
  setOsmNotesLoading: (osmNotesLoading) => set({ osmNotesLoading }),
  osmNotesError: false,
  setOsmNotesError: (osmNotesError) => set({ osmNotesError }),

  // Data for <Inspector> AND <LayerHighlight>
  // (!) Usually we don't want to use `inspectorFeatures` directly, use `getUniqueInspectorFeatures` instead!
  unfilteredInspectorFeatures: [],
  getUniqueInspectorFeatures: () => {
    // When we click on the map, MapLibre returns all Features for all layers.
    // For hidden layers like the hitarea layer, those features are duplicates which we filter out.
    const uniqueKeys: Record<string, boolean> = {}
    const { unfilteredInspectorFeatures: inspectorFeatures } = get()
    return inspectorFeatures.reduce((result: typeof inspectorFeatures, feature) => {
      if (!uniqueKeys[createInspectorFeatureKey(feature)]) {
        uniqueKeys[createInspectorFeatureKey(feature)] = true
        result.push(feature)
      }
      return result
    }, [])
  },
  setInspectorFeatures: (inspectorFeatures) =>
    set({ unfilteredInspectorFeatures: inspectorFeatures }),
  resetInspectorFeatures: () => set({ unfilteredInspectorFeatures: [] }),

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
}))
