import { isDev } from 'src/app/_components/utils/isEnv'
import { useMapDebugState } from 'src/app/regionen/[regionSlug]/_hooks/mapStateInteraction/useMapDebugState'
import { FileMapDataSubcategoryStyleLayer } from 'src/app/regionen/[regionSlug]/_mapData/types'
import { SubcategoryId } from '../../../../_mapData/typeId'
import { LegendDebugInfoLayerStyle } from './LegendDebugInfoLayerStyle'

type Props = {
  subcategoryId: SubcategoryId
  styleDataLayers: FileMapDataSubcategoryStyleLayer[] | undefined
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
