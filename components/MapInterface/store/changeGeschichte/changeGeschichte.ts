export function addGeschichte<T>(stored: T[], toAdd: T) {
  return stored ? [...stored, toAdd].filter(Boolean) : [toAdd]
}

export function removeGeschichte<T>(stored: T[], toRemove: T) {
  return stored?.filter((e) => e !== toRemove) || []
}

export function replaceGeschichte<T>(stored: T[], toAdd: T, toRemove: T) {
  return addGeschichte(removeGeschichte(stored, toRemove), toAdd)
}
