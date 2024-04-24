// See https://github.com/maplibre/maplibre-style-spec/blob/main/build/generate-style-spec.ts#L192
import { type ExpressionSpecification } from 'maplibre-gl'

export const wrapFilterWithAll = (filterArray: any[] | undefined) => {
  // Case: Input empty/undefined
  if (!filterArray) {
    return ['all'] as ExpressionSpecification
  }
  // Case: Input already wrapped in 'all'
  if (filterArray[0] === 'all') {
    return filterArray.filter(Boolean) as ExpressionSpecification
  }
  // Case: Input is multi dimensional array of filters
  if (typeof filterArray[0] === 'object') {
    return ['all', filterArray].flat().filter(Boolean) as ExpressionSpecification
  }
  // Case: Input is only one filter
  // @ts-expect-error (this line should be less of a problem that a `as unkown`?)
  return ['all', filterArray] as ExpressionSpecification
}
