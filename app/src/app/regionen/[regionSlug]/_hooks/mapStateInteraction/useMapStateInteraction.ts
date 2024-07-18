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
  StoreSizes &
  Actions

type StoreMapLoadedState = {
  mapLoaded: boolean
}

type StoreMapDataLoadingState = {
  mapDataLoading: boolean
}

type StoreSizes = {
  mapBounds: LngLatBounds | null
  inspectorSize: { width: number; height: number }
  sidebarLayerControlsSize: { width: number; height: number }
}

export type StoreFeaturesInspector = {
  // https://visgl.github.io/react-map-gl/docs/api-reference/types#mapgeojsonfeature
  inspectorFeatures: MapGeoJSONFeature[]
}

export type StoreCalculator = {
  calculatorAreasWithFeatures: {
    key: string
    features: MapGeoJSONFeature[]
  }[]
}

type StoreLocalUpdates = {
  localUpdates: Omit<TCreateVerificationSchema, 'id'>[]
}

type Actions = {
  actions: {
    setMapLoaded: (mapLoaded: Store['mapLoaded']) => void
    setMapDataLoading: (mapDataLoading: Store['mapDataLoading']) => void
    setMapBounds: (mapBounds: Store['mapBounds']) => void
    setInspectorSize: (inspectorSize: Store['inspectorSize']) => void
    setSidebarLayerControlsSize: (
      sidebarLayerControlsSize: Store['sidebarLayerControlsSize'],
    ) => void
    setInspectorFeatures: (inspectObject: Store['inspectorFeatures']) => void
    resetInspectorFeatures: () => void
    setCalculatorAreasWithFeatures: (
      calculatorAreasWithFeatures: Store['calculatorAreasWithFeatures'],
    ) => void
    addLocalUpdate: (id: Omit<TCreateVerificationSchema, 'id'>) => void
  }
}

function setIfChanged(get, set, name, value) {
  if (isEqual(get()[name], value)) return
  set({ [name]: value })
}

export const useMapStateInteraction = create<Store>((set, get) => {
  return {
    // Guards againt errors when using `mainMap?.getStyle`
    mapLoaded: false, // ********** DONE **********
    // Toggels <LoadingIndicator>
    mapDataLoading: false, // ********** DONE **********
    // Data for <Inspector> AND <LayerHighlight>
    inspectorFeatures: [], // ********** DONE **********
    // Data for <Inspector> AND <LayerHighlight>
    calculatorAreasWithFeatures: [], // ********** DONE **********
    // Data for optimistic updates; show verification immediately <LayerHightlight>
    localUpdates: [],
    mapBounds: null, // ********** DONE **********
    inspectorSize: { width: 0, height: 0 },
    sidebarLayerControlsSize: { width: 0, height: 0 },
    actions: {
      setMapLoaded: (mapLoaded) => set({ mapLoaded }),
      setMapDataLoading: (mapDataLoading) => set({ mapDataLoading }),
      setInspectorFeatures: (inspectorFeatures) => set({ inspectorFeatures }),
      resetInspectorFeatures: () => set({ inspectorFeatures: [] }),
      setCalculatorAreasWithFeatures: (calculatorAreasWithFeatures) =>
        set({ calculatorAreasWithFeatures }),
      addLocalUpdate: (update) => {
        const { localUpdates } = get()
        set({
          localUpdates: [...localUpdates, update],
        })
      },
      setMapBounds: (bounds) => set({ mapBounds: bounds }),
      setInspectorSize: (size) => setIfChanged(get, set, 'inspectorSize', size),
      setSidebarLayerControlsSize: (size) => {
        setIfChanged(get, set, 'sidebarLayerControlsSize', size)
      },
    },
  }
})

export const useMapStoreLoaded = () => useMapStateInteraction((state) => state.mapLoaded)
export const useMapStoreDataLoading = () => useMapStateInteraction((state) => state.mapDataLoading)
export const useMapStoreInspectorFeatures = () =>
  useMapStateInteraction((state) => state.inspectorFeatures)
export const useMapStoreCalculatorAreasWithFeatures = () =>
  useMapStateInteraction((state) => state.calculatorAreasWithFeatures)
export const useMapStoreBounds = () => useMapStateInteraction((state) => state.mapBounds)

export const useMapStoreActions = () => useMapStateInteraction((state) => state.actions)
