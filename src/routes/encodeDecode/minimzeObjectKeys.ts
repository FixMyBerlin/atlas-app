const translateKeys = [
  // Mainly for ?config
  ['id', 'i'],
  ['active', 'a'],
  ['styles', 's'],
  ['default', 'd'],
  ['options', 'o'],
  // Mainly for ?map (GeoJSON)
  ['type', 't'],
  ['properties', 'p'],
  ['geometry', 'g'],
  ['coordinates', 'c'],
] as const

// type TTransTableKeys = keyof typeof transTable
// type TTransTableValues = (typeof transTable)[TTransTableKeys]

// Some input at https://stackoverflow.com/a/63116708/729221
type TInput =
  | Record<string, any>
  | Array<any>
  | null
  | undefined
  | number
  | string
  | boolean
  | object

// Thanks to https://stackoverflow.com/a/63116708/729221 for inspiration
// TODO Fix types for helper
// @ts-ignore don't know how to type this
const replaceKeyInNestedObject = (
  input: TInput,
  searchKey: string,
  newKey: string
) => {
  if (Array.isArray(input)) {
    return input.map((innerInput: TInput) =>
      replaceKeyInNestedObject(innerInput, searchKey, newKey)
    )
  }
  if (typeof input === 'object' && input !== null) {
    return Object.fromEntries(
      Object.entries(input).map(([innerKey, value]: [string, TInput]) => {
        const newValue: TInput | string =
          typeof value === 'object'
            ? replaceKeyInNestedObject(value, searchKey, newKey)
            : value
        return [innerKey === searchKey ? newKey : innerKey, newValue]
      })
    )
  }
  return input
}

export const minimizeObjectKeys = (inputObject: TInput) => {
  let minimizedObject = inputObject
  translateKeys.forEach(([fromKey, toKey]) => {
    minimizedObject = replaceKeyInNestedObject(minimizedObject, fromKey, toKey)
  })

  return minimizedObject as Record<string, any>
}

export const expandObjectKeys = (inputObject: TInput) => {
  let minimizedObject = inputObject
  translateKeys.forEach(([toKey, fromKey]) => {
    minimizedObject = replaceKeyInNestedObject(minimizedObject, fromKey, toKey)
  })

  return minimizedObject as Record<string, any>
}
