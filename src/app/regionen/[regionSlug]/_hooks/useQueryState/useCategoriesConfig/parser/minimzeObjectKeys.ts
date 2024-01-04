const translateKeys = [
  // Mainly for ?config
  ['subcategories', 'sc'],
  ['id', 'i'],
  ['active', 'a'],
  ['styles', 's'],
  ['default', 'd'],
  ['options', 'o'],
  ['filters', 'f'], // not used anymore
  // Mainly for ?map (GeoJSON)
  ['type', 't'],
  ['properties', 'p'],
  ['geometry', 'g'],
  ['coordinates', 'c'],
] as const

// Some input at https://stackoverflow.com/a/63116708/729221
type TObjectInput =
  | Record<string, any>
  | any[]
  | null
  | undefined
  | number
  | string
  | boolean
  | object

// Thanks to https://stackoverflow.com/a/63116708/729221 for inspiration
// TODO TS types could be a lot nicer here…
const replaceKeyInNestedObject = <TInput>(input: TInput, searchKey: string, newKey: string) => {
  if (Array.isArray(input)) {
    const output = input.map((innerInput: TInput) => {
      const output = replaceKeyInNestedObject<TObjectInput>(
        innerInput as TObjectInput,
        searchKey,
        newKey,
      ) as Record<string, TInput>
      return output
    })
    return output
  }

  if (typeof input === 'object' && input !== null) {
    const output = Object.fromEntries(
      Object.entries(input).map(([innerKey, value]: [string, TObjectInput]) => {
        const newValue: TObjectInput | string =
          typeof value === 'object'
            ? replaceKeyInNestedObject<TObjectInput>(value, searchKey, newKey)
            : value
        const output = [innerKey === searchKey ? newKey : innerKey, newValue] as [
          string,
          TObjectInput,
        ]
        return output
      }),
    )
    return output
  }

  return input
}

export const minimizeObjectKeys = (inputObject: Record<string, any>) => {
  let minimizedObject = inputObject
  translateKeys.forEach(([fromKey, toKey]) => {
    minimizedObject = replaceKeyInNestedObject<Record<string, TObjectInput>>(
      minimizedObject,
      fromKey,
      toKey,
    )
  })

  return minimizedObject
}

export const expandObjectKeys = (inputObject: Record<string, any>) => {
  let expandedObject = inputObject
  translateKeys.forEach(([toKey, fromKey]) => {
    expandedObject = replaceKeyInNestedObject<Record<string, TObjectInput>>(
      expandedObject,
      fromKey,
      toKey,
    )
  })

  return expandedObject
}
