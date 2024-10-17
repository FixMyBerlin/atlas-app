import { RegionSlug } from '@/src/app/regionen/(index)/_data/regions.const'
import { useStaticRegion } from '@/src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { SourceLayerBikelanes } from './SourceLayerBikelanes'
import { SourceLayerRegionBbSg } from './SourceLayerRegionBbSg'

// This is a temporary solution until we know more about which data
// to show for the different "new note" maps.
const sourcePerRegion: Record<RegionSlug & 'default', React.ReactNode> = {
  'bb-sg': <SourceLayerRegionBbSg />,
}

export const SourceLayerForRegion = () => {
  const region = useStaticRegion()

  if (!region) return null
  if (region.slug in sourcePerRegion) {
    return sourcePerRegion[region.slug]
  }

  // Fallback
  return <SourceLayerBikelanes />
}
