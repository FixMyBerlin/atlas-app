const transTable = {
  // Mainly for ?config
  id: 'i',
  active: 'a',
  style: 's',
  default: 'd',
  options: 'o',
  // Mainly for ?map (GeoJSON)
  type: 't',
  properties: 'p',
  geometry: 'g',
  coordinates: 'c',
} as const

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
  let output: Record<string, any> | undefined = undefined
  if (Array.isArray(input)) {
    output = input.map((innerInput: TInput) =>
      replaceKeyInNestedObject(innerInput, searchKey, newKey)
    )
  }
  if (typeof input === 'object' && input !== null) {
    output = Object.fromEntries(
      Object.entries(input).map(([innerKey, value]: [string, TInput]) => {
        const newValue: TInput | string =
          typeof value === 'object'
            ? replaceKeyInNestedObject(value, searchKey, newKey)
            : value
        return [innerKey === searchKey ? newKey : innerKey, newValue]
      })
    )
  }
  return output || input
}

export const minimizeObjectKeys = (inputObject: TInput) => {
  if (
    !inputObject ||
    typeof inputObject !== 'object' ||
    Array.isArray(inputObject)
  ) {
    return inputObject
  }

  let minimizedObject = inputObject
  const fromToTable = Object.entries(transTable)
  fromToTable.forEach(([fromKey, toKey]) => {
    minimizedObject = replaceKeyInNestedObject(minimizedObject, fromKey, toKey)
  })

  return minimizedObject as Record<string, any>
}

export const expandObjectKeys = (inputObject: TInput) => {
  if (
    !inputObject ||
    typeof inputObject !== 'object' ||
    Array.isArray(inputObject)
  ) {
    return inputObject
  }

  let minimizedObject = inputObject
  const fromToTable = Object.entries(transTable)
  fromToTable.forEach(([toKey, fromKey]) => {
    minimizedObject = replaceKeyInNestedObject(minimizedObject, fromKey, toKey)
  })

  return minimizedObject as Record<string, any>
}
