export const wrapFilterWithAll = (filterArray: any[] | undefined) => {
  // Case: Input empty/undefined
  if (!filterArray) {
    return ['all']
  }
  // Case: Input already wrapped in 'all'
  if (filterArray[0] === 'all') {
    return filterArray
  }
  // Case: Input is multi dimensional array of filters
  if (typeof filterArray[0] === 'object') {
    return ['all', filterArray].flat()
  }
  // Case: Input is only one filter
  return ['all', filterArray]
}
