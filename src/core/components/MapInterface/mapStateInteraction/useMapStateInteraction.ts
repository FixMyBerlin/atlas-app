import { TVerificationApiGet } from '@api/index'
import { MapboxGeoJSONFeature } from 'react-map-gl'
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

type StoreOsmNotesState = {
  osmNotesLoading: boolean
  setOsmNotesLoading: (osmNotesLoaded: Store['osmNotesLoading']) => void
}

type StorePmTilesProtocolState = {
  pmTilesProtocolReady: boolean
  setPmTilesProtocolReady: (pmTilesProtocolReady: Store['pmTilesProtocolReady']) => void
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
    calculatorAreasWithFeatures: Store['calculatorAreasWithFeatures'],
  ) => void
}

type StoreLocalUpdates = {
  localUpdates: TVerificationApiGet[]
  addLocalUpdate: (update: TVerificationApiGet) => void
  // TODO MIGRATION: Do we still need removeLocalUpdate ?
  removeLocalUpdate: (update: TVerificationApiGet) => void
}

export const useMapStateInteraction = create<Store>((set, get) => ({
  mapLoaded: false,
  setMapLoaded: (mapLoaded) => set({ mapLoaded }),

  osmNotesLoading: false,
  setOsmNotesLoading: (osmNotesLoading) => set({ osmNotesLoading }),

  pmTilesProtocolReady: false,
  setPmTilesProtocolReady: (pmTilesProtocolReady) => set({ pmTilesProtocolReady }),

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
