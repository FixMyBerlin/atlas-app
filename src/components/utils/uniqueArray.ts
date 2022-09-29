// Make array unique `Array.from(new Set[/* non-unique array */]))` https://stackoverflow.com/a/9229821/729221
export const uniqueArray = (existingArray: any[], toAdd: any[] | string) => {
  let arrayToAdd = typeof toAdd === 'string' ? [toAdd] : toAdd

  return Array.from(new Set([...existingArray, ...arrayToAdd]))
}
