export const deleteKeyFromObject = (object: any, keyToDelete: string) => {
  return Object.fromEntries(
    Object.entries(object).filter(([key, _]) => key !== keyToDelete)
  )
}
