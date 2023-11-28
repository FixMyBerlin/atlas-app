import { useRegionSlug } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useRegionSlug'
import { sourcesDatasets } from '../../mapData/sourcesMapData/sourcesDatasets/sourcesDatasets.const'

export const useRegionDatasets = () => {
  const regionSlug = useRegionSlug()
  const regionDatasets = sourcesDatasets.filter((d) => d.regionKey.includes(regionSlug as any))

  return regionDatasets
}
