export const addGeschichte = <T>(stored: T[], toAdd: T) => {
  return stored ? [...stored, toAdd].filter(Boolean) : [toAdd]
}

export const removeGeschichte = <T>(stored: T[], toRemove: T) => {
  return stored?.filter((e) => e !== toRemove) || []
}

export const replaceGeschichte = <T>(stored: T[], toAdd: T, toRemove: T) => {
  return addGeschichte(removeGeschichte(stored, toRemove), toAdd)
}
