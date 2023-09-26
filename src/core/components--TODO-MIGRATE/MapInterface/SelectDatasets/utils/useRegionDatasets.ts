import { sourcesDatasets } from 'src/core/components--TODO-MIGRATE/MapInterface/mapData/sourcesMapData'
import { useMatch } from '@tanstack/react-location'

export const useRegionDatasets = () => {
  const {
    params: { regionPath },
  } = useMatch()

  const regionDatasets = sourcesDatasets.filter((d) => d.regionKey.includes(regionPath as any))

  return regionDatasets
}
