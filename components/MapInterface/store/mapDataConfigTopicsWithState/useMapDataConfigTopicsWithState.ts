import { useMemo } from 'react'
import {
  mapDataConfigTopicsWithState,
  Props,
} from './mapDataConfigTopicsWithState'

export const useMapDataConfigTopicsWithState = ({
  selectedTopicIds,
  selectedStyleKeys,
  selectedStylesFilterOptionKeys,
}: Props) => {
  return useMemo(
    () =>
      mapDataConfigTopicsWithState({
        selectedTopicIds,
        selectedStyleKeys,
        selectedStylesFilterOptionKeys,
      }),
    [selectedTopicIds, selectedStyleKeys, selectedStylesFilterOptionKeys]
  )
}
