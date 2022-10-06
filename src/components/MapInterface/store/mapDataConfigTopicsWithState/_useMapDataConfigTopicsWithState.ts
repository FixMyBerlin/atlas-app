import { MapDataConfigThemeIds } from '@components/MapInterface/mapData/themesMapDataConfig'
import { useMemo } from 'react'
import { mapDataConfigTopicsWithState } from './mapDataConfigTopicsWithState'

type Props = { themeId: MapDataConfigThemeIds }

// TODO this does not work … lets figure out why later…
export const useMapDataConfigTopicsWithState = ({ themeId }: Props) => {
  return useMemo(() => mapDataConfigTopicsWithState({ themeId }), [themeId])
}
