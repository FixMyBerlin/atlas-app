import { MapboxGeoJSONFeature } from 'react-map-gl'
import create from 'zustand'
import { sourcesList } from '../Map'
import { backgroundLayer } from '../Map/backgrounds'
import { visualisationsList } from '../Map/parkingLanes'
import { availableYears } from '../Map/unfallatlas/filterUnfallatlas'

export type StoreMap = StoreSelectedBackground &
  StoreSelectedVis &
  StoreSelectedSources &
  StoreSelectedFilters &
  StoreFeaturesInspector &
  StoreFeaturesCalculator

export type StoreSelectedBackground = {
  selectedBackground: null | keyof typeof backgroundLayer
  selectBackground: (
    selectedBackground: StoreSelectedBackground['selectedBackground']
  ) => void
}

// TODO: Muss abstrahiert werden; funktioniert jetzt nur für ParkingLanes
export type StoreSelectedVis = {
  selectedVis: null | keyof typeof visualisationsList
  selectVis: (activeVis: StoreSelectedVis['selectedVis']) => void
}

export type StoreSelectedSources = {
  selectedSources: null | Array<keyof typeof sourcesList>
  addSource: (source: keyof typeof sourcesList) => void
  removeSource: (source: keyof typeof sourcesList) => void
}

// TODO: Muss abstrahiert werden; funktioniert jetzt nur für den einen Jahres-Filter
export type StoreSelectedFilters = {
  selectedFilters: null | Array<keyof typeof availableYears>
  addFilter: (filter: keyof typeof availableYears) => void
  removeFilter: (filter: keyof typeof availableYears) => void
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
  selectedBackground: null,
  selectBackground: (selectedBackground) => set({ selectedBackground }),

  selectedVis: 'default',
  selectVis: (selectedVis) => set({ selectedVis }),

  selectedSources: ['parkingLanes', 'boundaries'],
  addSource: (sourceToAdd) => {
    const { selectedSources } = get()
    set({ selectedSources: [...selectedSources, sourceToAdd] })
  },
  removeSource: (sourceToRemove) => {
    const { selectedSources } = get()
    set({
      selectedSources: selectedSources.filter((e) => e !== sourceToRemove),
    })
  },

  selectedFilters: ['2017', '2018', '2019'],
  addFilter: (filterToAdd) => {
    const { selectedFilters } = get()
    console.log('addFilter', {
      selectedFilters,
      after: [...selectedFilters, filterToAdd],
    })
    set({ selectedFilters: [...selectedFilters, filterToAdd] })
  },
  removeFilter: (filterToRemove) => {
    const { selectedFilters } = get()
    console.log('removeFilter', {
      selectedFilters,
      after: selectedFilters.filter((e) => e !== filterToRemove),
    })
    set({
      selectedFilters: selectedFilters.filter((e) => e !== filterToRemove),
    })
  },

  inspectorFeatures: [],
  setInspector: (inspectorFeatures) => set({ inspectorFeatures }),

  calculatorFeatures: [],
  addToCalculator: (featuresToAdd) => {
    const featuresWithCapacity = featuresToAdd.filter(
      (f) => f.properties.capacity
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
        (s) => s.properties.id !== featureToRemove.properties.id
      ),
    })
  },
  clearCalculator: () => {
    set({ calculatorFeatures: [] })
  },
}))
