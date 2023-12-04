import { sourcesDatasets } from '../../../_mapData/mapDataSources/sourcesDatasets/sourcesDatasets.const'
import { useRegionSlug } from '../../regionUtils/useRegionSlug'

export const useRegionDatasets = () => {
  const regionSlug = useRegionSlug()
  const regionDatasets = sourcesDatasets.filter((d) => d.regionKey.includes(regionSlug as any))

  return regionDatasets
}
