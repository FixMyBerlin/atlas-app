export const wrapFilterWithAll = (filterArray: any[] | undefined) => {
  let workingArray: typeof filterArray = []
  // Cleanup input: `[null]` becomes `[]`
  workingArray = filterArray?.filter(Boolean)
  // Cleanup input: `[]` becomes `undefined`
  if (workingArray?.length === 0) {
    workingArray = undefined // `[]` becomes `undefined`
  }

  // Case: Input empty/undefined
  if (!workingArray) {
    return ['all']
  }

  // Cleanup input: 'all's are removed
  workingArray = workingArray.filter((item) => !(typeof item === 'string' && item === 'all'))

  // Case: Input is multi dimensional array of filters
  if (Array.isArray(workingArray[0])) {
    return ['all', workingArray].flat().filter(Boolean)
  }
  // Case: Input is only one filter
  return ['all', workingArray].filter(Boolean)
}
