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
  coordinate: 'c',
} as const

// type TTransTableKeys = keyof typeof transTable
// type TTransTableValues = (typeof transTable)[TTransTableKeys]

// Thanks to https://stackoverflow.com/a/63109717/729221
const replaceKeyInNestedObject = (
  object: Record<string, any>,
  oldKey: string,
  newKey: string,
  newObj: Record<string, any> = {}
) => {
  for (const key in object) {
    newObj[key === oldKey ? newKey : key] = replaceKeyInNestedObject(
      object[key],
      oldKey,
      newKey
    )
  }
  return newObj
}

export const minimizeObjectKeys = (
  inputObject:
    | Record<string, any>
    | Array<any>
    | null
    | undefined
    | number
    | string
    | boolean
) => {
  if (
    !inputObject ||
    typeof inputObject !== 'object' ||
    Array.isArray(inputObject)
  ) {
    return inputObject
  }

  let minimizedObject = {}
  const fromToTable = Object.entries(transTable)
  fromToTable.forEach(([fromKey, toKey]) => {
    minimizedObject = replaceKeyInNestedObject(
      minimizedObject,
      fromKey,
      toKey,
      minimizedObject
    )
  })

  return minimizedObject
}
