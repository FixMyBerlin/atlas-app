import { sourcesDatasets } from '@components/MapInterface/mapData/sourcesMapData/sourcesDatasets.const'
import { useMatch } from '@tanstack/react-location'

export const useRegionDatasets = () => {
  const {
    params: { regionPath },
  } = useMatch()

  const regionDatasets = sourcesDatasets.filter((d) => d.regionKey.includes(regionPath as any))

  return regionDatasets
}
