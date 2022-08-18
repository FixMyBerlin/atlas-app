import { SourcesListKeys } from '../../Map'

export type SelectedSources = null | SourcesListKeys[]

export const addSource = (
  selectedSources: SelectedSources,
  sourceToAdd: SourcesListKeys
) => {
  return selectedSources
    ? [...selectedSources, sourceToAdd].filter(Boolean)
    : [sourceToAdd]
}

export const removeSource = (
  selectedSources: SelectedSources,
  sourceToRemove: SourcesListKeys
) => {
  return selectedSources?.filter((e) => e !== sourceToRemove) || []
}
