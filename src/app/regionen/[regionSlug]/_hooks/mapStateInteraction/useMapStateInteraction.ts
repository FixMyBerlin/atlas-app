import { MapGeoJSONFeature, MapboxGeoJSONFeature } from 'react-map-gl'
import { TCreateVerificationSchema } from 'src/bikelane-verifications/schemas'
import { create } from 'zustand'
import { LngLatBounds } from 'maplibre-gl'
import { createInspectorFeatureKey } from '../../_components/utils/sourceKeyUtils/createInspectorFeatureKey'
import { isEqual } from 'lodash'

// INFO DEBUGGING: We could use a middleware to log state changes https://github.com/pmndrs/zustand#middleware

export type Store = StoreMapLoadedState &
  StoreMapDataLoadingState &
  StoreFeaturesInspector &
  StoreCalculator &
  StoreLocalUpdates &
  StoreOsmNotesState &
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

type StoreOsmNotesState = {
  osmNotesLoading: boolean
  setOsmNotesLoading: (osmNotesLoaded: Store['osmNotesLoading']) => void
  osmNotesError: boolean
  setOsmNotesError: (osmNotesError: Store['osmNotesError']) => void
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

function setIfChanged(get, set, name, value) {
  if (isEqual(get()[name], value)) return
  set({ [name]: value })
}

export const useMapStateInteraction = create<Store>((set, get) => {
  return {
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
