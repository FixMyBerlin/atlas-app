// See https://github.com/maplibre/maplibre-style-spec/blob/main/build/generate-style-spec.ts#L192
import { type FilterSpecification } from 'maplibre-gl'

/** @desc Private method, exported only for testing */
export const _flattenFilter = (filterArray: any[] | undefined) => {
  if (!Array.isArray(filterArray)) {
    return []
  }

  const result: any[] = []
  // TS: Array.isArray will break TS and https://github.com/total-typescript/ts-reset/pull/23 does not fix it, yet. So we have to cast `as any[]` again here
  for (const item of filterArray as any[]) {
    if (Array.isArray(item) && typeof item[0] === 'string' && item[0] !== 'all') {
      // If item is an array and its first element is a string which is not "all", add it to the result
      result.push(item)
    } else {
      // Recursively process item and add the results to the result
      result.push(..._flattenFilter(item))
    }
  }

  return result
}

export const wrapFilterWithAll = (filterArray: any[] | undefined) => {
  // Case: Filter expression is passed directly, no wrapping array
  if (
    Array.isArray(filterArray) &&
    typeof filterArray[0] === 'string' &&
    filterArray[0] !== 'all'
  ) {
    // @ts-expect-error no idea what TS wants, but this should be fine
    return ['all', filterArray] as FilterSpecification
  }

  // Case: Array of filter expressions that we cleanup recursively and then wrap
  const flatFilterArray = _flattenFilter(filterArray)

  if (flatFilterArray.length === 0) {
    return ['all'] as FilterSpecification
  }

  return ['all', ...flatFilterArray] as FilterSpecification
}
