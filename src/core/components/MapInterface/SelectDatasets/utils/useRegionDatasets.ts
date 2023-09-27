import { sourcesDatasets } from 'src/core/components/MapInterface/mapData/sourcesMapData'
import { useRegionSlug } from 'src/core/components/regionUtils/useRegionSlug'

export const useRegionDatasets = () => {
  const regionSlug = useRegionSlug()
  const regionDatasets = sourcesDatasets.filter((d) => d.regionKey.includes(regionSlug as any))

  return regionDatasets
}
