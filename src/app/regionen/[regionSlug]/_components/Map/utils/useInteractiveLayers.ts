import { useRegionDatasets } from 'src/app/regionen/[regionSlug]/_hooks/useRegionDatasets/useRegionDatasets'
import { useCategoriesConfig } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/useCategoriesConfig'
import { useDataParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useDataParam'
import { useOsmNotesParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useOsmNotesParam'
import { getSourceData } from '../../../_mapData/utils/getMapDataUtils'
import { MapDataCategoryConfig } from '../../../_hooks/useQueryState/useCategoriesConfig/type'
import { createLayerKeyAtlasGeo } from '../../utils/sourceKeyUtils/sourceKeyUtilsAtlasGeo'
import {
  createSourceKeyStaticDatasets,
  createDatasetSourceLayerKey,
} from '../../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { osmNotesLayerId } from '../SourcesAndLayers/SourcesLayersOsmNotes'

type Props = { categories: MapDataCategoryConfig[] | undefined }

const collectInteractiveLayerIdsFromCategory = ({ categories }: Props) => {
  const interactiveLayerIds: string[] = []

  categories?.forEach((categoryConfig) => {
    if (categoryConfig.active === false) return

    return categoryConfig?.subcategories?.forEach((subcatConfig) => {
      subcatConfig.styles.forEach((styleConfig) => {
        if (styleConfig.id === 'hidden') return
        if (styleConfig.active === false) return

        styleConfig.layers.forEach((layerConfig) => {
          // Only if `inspector.enabled` do we want to enable the layer (which enables the Inspector)
          const sourceData = getSourceData(subcatConfig.sourceId)
          if (!sourceData.inspector.enabled) return

          const layerData = styleConfig.layers.find((l) => l.id === layerConfig.id)
          if (layerData?.interactive === false) return

          const layerKey = createLayerKeyAtlasGeo(
            subcatConfig.sourceId,
            subcatConfig.id,
            styleConfig.id,
            layerConfig.id,
          )

          interactiveLayerIds.push(layerKey)
        })
      })
    })
  })

  // For some reasons we have duplicated layerIds. Those do not show up as duplicates from <SourcesAndLayers />
  // For now, we just clean them in place…
  const duplicatesRemoved = interactiveLayerIds.filter((value, index, self) => {
    return self.indexOf(value) === index
  })

  return duplicatesRemoved
}

export const useInteractiveLayers = () => {
  // active layer from category
  const { categoriesConfig } = useCategoriesConfig()
  const activeCategoriesConfig = categoriesConfig?.filter((th) => th.active === true)

  const activeCategoryLayerIds = collectInteractiveLayerIdsFromCategory({
    categories: activeCategoriesConfig,
  })

  const { osmNotesParam } = useOsmNotesParam()
  if (osmNotesParam) {
    activeCategoryLayerIds.push(osmNotesLayerId)
  }

  // active layer from datasets
  const { dataParam: selectedDatasetIds } = useDataParam()
  const regionDatasets = useRegionDatasets()
  const datasetsActiveLayerIds =
    regionDatasets
      .filter((dataset) => dataset.inspector.enabled)
      .filter((dataset) => {
        return selectedDatasetIds?.includes(
          createSourceKeyStaticDatasets(dataset.id, dataset.subId),
        )
      })
      .map((dataset) => {
        return dataset.layers.map((layer) => {
          return createDatasetSourceLayerKey(dataset.id, dataset.subId, layer.id)
        })
      })
      .flat() || []

  return [...activeCategoryLayerIds, ...datasetsActiveLayerIds]
}
