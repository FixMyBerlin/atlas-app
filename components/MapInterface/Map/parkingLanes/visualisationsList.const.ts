export type VisualisationsListKeys = keyof typeof visualisationsList

export const visualisationsList = {
  default: { displayName: 'Standard' },
  presence: { displayName: 'Vollständigkeit' },
  debugLengthPerCapacity: { displayName: 'Debug Lange<>Kapazität' },
}
