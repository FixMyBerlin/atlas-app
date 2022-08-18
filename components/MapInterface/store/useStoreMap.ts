import { MapboxGeoJSONFeature } from 'react-map-gl'
import create from 'zustand'
import { SourcesListKeys } from '../Map'
import { SourcesRasterKey } from '../Map/backgrounds'
import { VisualisationsListKeys } from '../Map/parkingLanes'
import { FilterUnfallatlassYearKeys } from '../Map/unfallatlas/filterUnfallatlas'

export type StoreMap = StoreSelectedVis &
  StoreSelectedFilters &
  StoreFeaturesInspector &
  StoreFeaturesCalculator

// TODO – Muss abstrahiert werden; funktioniert jetzt nur für ParkingLanes
export type StoreSelectedVis = {
  selectedVis: null | VisualisationsListKeys
  selectVis: (activeVis: null | VisualisationsListKeys) => void
}

// TODO – Muss abstrahiert werden; funktioniert jetzt nur für den einen Jahres-Filter
export type StoreSelectedFilters = {
  selectedFilters: null | FilterUnfallatlassYearKeys[]
  addFilter: (filter: FilterUnfallatlassYearKeys) => void
  removeFilter: (filter: FilterUnfallatlassYearKeys) => void
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
  selectedVis: 'default',
  selectVis: (selectedVis) => set({ selectedVis }),

  selectedFilters: ['2017', '2018', '2019'],
  addFilter: (filterToAdd) => {
    const { selectedFilters } = get()
    set({
      selectedFilters: selectedFilters
        ? [...selectedFilters, filterToAdd]
        : [filterToAdd],
    })
  },
  removeFilter: (filterToRemove) => {
    const { selectedFilters } = get()
    set({
      selectedFilters:
        selectedFilters?.filter((e) => e !== filterToRemove) || null,
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
