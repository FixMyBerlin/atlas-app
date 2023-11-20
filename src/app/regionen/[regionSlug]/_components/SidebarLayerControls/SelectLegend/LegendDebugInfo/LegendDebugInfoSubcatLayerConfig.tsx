import { isDev } from 'src/app/_components/utils/isEnv'
import { useMapDebugState } from 'src/app/regionen/[regionSlug]/_components/mapStateInteraction/useMapDebugState'
import { SubcategoryIds } from 'src/regions/data/map/subcategories/types'
import { MapDataVisLayer } from 'src/regions/data/map/types'
import { LegendDebugInfoLayerStyle } from './LegendDebugInfoLayerStyle'

type Props = {
  subcategoryId: SubcategoryIds
  styleDataLayers: MapDataVisLayer[] | undefined
}

export const LegendDebugInfoSubcatLayerConfig = ({ subcategoryId, styleDataLayers }: Props) => {
  const { showDebugInfo } = useMapDebugState()

  if (!isDev || !showDebugInfo) return null

  return (
    <LegendDebugInfoLayerStyle
      title={`Debug info: All layer and their styles for subcategory "${subcategoryId}" (since subcategory config does not specify layers (yet or by design))`}
      layers={styleDataLayers}
    />
  )
}
