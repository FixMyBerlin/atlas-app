import { MapDataConfigStyleInteractiveFilter } from '../../types'

// TODO extract into utils; add specs
export const specifyFilters = (
  interactiveFilters: null | MapDataConfigStyleInteractiveFilter[],
  layerFilter: undefined | any[],
  selectedFilters: null | string[]
) => {
  // Case 1: Our config has no interactiveFilters. We want to return the layer Filter.
  // Case 2: HOWEVER, the layerFilter might be undefined, which we cannot pass into <Layer>
  //    What we can pass as empty filter is an empty `['all']`
  //    However, the layerFilter could still have content itself, in this case that is returned.
  if (!interactiveFilters?.length) {
    if (layerFilter?.[0] === 'all') return layerFilter
    return ['all', layerFilter].filter(Boolean)
  }
  // Second guard is only to make TS happy
  if (!layerFilter) return ['all', layerFilter].filter(Boolean)

  // We collect all interactiveFilter. We only support 'match+get'
  const additionalFilter = interactiveFilters
    .filter((f) => f?.filterConfig?.lookupKey !== undefined)
    .map((interactiveFilter) => {
      const key = interactiveFilter.filterConfig.lookupKey
      return ['match', ['get', key], selectedFilters || [], true, false]
    })

  // Case 3: When the layer already is an 'all'-filter, we just add ours at the end.
  //  Structure is ['all', [/* filterArry */], [/* filterArry */]]
  // Case 4: When the layer is a plain filterArray, we add the 'all' and merge both.
  if (layerFilter[0] === 'all') {
    return [...layerFilter, ...additionalFilter]
  } else {
    return ['all', ...layerFilter, ...additionalFilter]
  }
}
