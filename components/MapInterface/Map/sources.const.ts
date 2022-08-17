export type SourcesListKeys = keyof typeof sourcesList

export const sourcesList = {
  parkingLanes: { displayName: 'Parkraum' },
  unfallatlas: { displayName: 'Unfälle' },
  boundaries: { displayName: 'Grenzen' },
}
