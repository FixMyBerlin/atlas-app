export const localDateTime = (date: Date | undefined | null) => {
  if (!date) return undefined
  return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`
}
