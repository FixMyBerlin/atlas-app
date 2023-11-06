import { MapGeoJSONFeature, MapboxGeoJSONFeature } from 'react-map-gl'
import { TCreateVerificationSchema } from 'src/bikelane-verifications/schemas'
import { create } from 'zustand'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

type Store = StoreMapLoadedState &
  StorePmTilesProtocolState &
  StoreFeaturesInspector &
  StoreCalculator &
  StoreLocalUpdates &
  StoreOsmNotesState

type StoreMapLoadedState = {
  mapLoaded: boolean
  setMapLoaded: (mapLoaded: Store['mapLoaded']) => void
}

type StorePmTilesProtocolState = {
  pmTilesProtocolReady: boolean
  setPmTilesProtocolReady: (pmTilesProtocolReady: Store['pmTilesProtocolReady']) => void
}

type StoreOsmNotesState = {
  osmNotesLoading: boolean
  setOsmNotesLoading: (osmNotesLoaded: Store['osmNotesLoading']) => void
  osmNotesError: boolean
  setOsmNotesError: (osmNotesError: Store['osmNotesError']) => void
}

export type StoreFeaturesInspector = {
  // https://visgl.github.io/react-map-gl/docs/api-reference/types#mapgeojsonfeature
  inspectorFeatures: MapGeoJSONFeature[]
  setInspector: (inspectObject: Store['inspectorFeatures']) => void
  resetInspector: () => void
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

  pmTilesProtocolReady: false,
  setPmTilesProtocolReady: (pmTilesProtocolReady) => set({ pmTilesProtocolReady }),

  // We store this globally to separate the fetching from the UI logic
  osmNotesLoading: false,
  setOsmNotesLoading: (osmNotesLoading) => set({ osmNotesLoading }),
  osmNotesError: false,
  setOsmNotesError: (osmNotesError) => set({ osmNotesError }),

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
}))