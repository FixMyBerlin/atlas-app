export type ObjectWithState<T> = T & { active: boolean }

export const addStateToObject = <T>(
  object: T,
  stateValue: boolean
): ObjectWithState<T> => {
  return { ...object, active: stateValue }
}
