import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { sourcesDatasets } from 'src/regions/data/map/datasets/sourcesDatasets.const'

export const useRegionDatasets = () => {
  const regionSlug = useRegionSlug()
  const regionDatasets = sourcesDatasets.filter((d) => d.regionKey.includes(regionSlug as any))

  return regionDatasets
}
