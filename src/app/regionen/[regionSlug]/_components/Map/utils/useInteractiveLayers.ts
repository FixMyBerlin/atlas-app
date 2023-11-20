import { useRegionDatasets } from 'src/app/regionen/[regionSlug]/_components/SelectDatasets/utils/useRegionDatasets'
import { useConfigParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParam'
import { useDataParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useDataParam'
import { useOsmNotesParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useOsmNotesParam'
import {
  getSourceData,
  getStyleData,
  getSubcategoryData,
} from 'src/regions/data/map/utils/getMapDataUtils'
import { CategoryConfig } from '../../mapStateConfig/type'
import {
  createDatasetSourceLayerKey,
  createSourceSubcatStyleLayerKey,
} from '../../utils/createKeyUtils/createKeyUtils'
import { osmNotesLayerId } from '../SourcesAndLayers/SourcesLayersOsmNotes'

type Props = { categories: CategoryConfig[] | undefined }

const collectInteractiveLayerIdsFromCategory = ({ categories }: Props) => {
  const interactiveLayerIds: string[] = []

  categories?.forEach((categoryConfig) => {
    if (categoryConfig.active === false) return

    return categoryConfig?.subcategories?.forEach((subcatConfig) => {
      const subcatData = getSubcategoryData(subcatConfig.id)

      subcatConfig.styles.forEach((styleConfig) => {
        const styleData = getStyleData(subcatData, styleConfig.id)
        if (styleData.id === 'hidden') return
        if (styleConfig.active === false) return

        styleData.layers.forEach((layerConfig) => {
          // Only if `inspector.enabled` do we want to enable the layer (which enables the Inspector)
          const sourceData = getSourceData(subcatData.sourceId)
          if (!sourceData.inspector.enabled) return

          const layerData = styleData.layers.find((l) => l.id === layerConfig.id)
          if (layerData?.interactive === false) return

          const layerKey = createSourceSubcatStyleLayerKey(
            subcatData.sourceId,
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
  const { configParam } = useConfigParam()
  const currentCategories = configParam?.filter((th) => th.active === true)

  const categoryActiveLayerIds = collectInteractiveLayerIdsFromCategory({
    categories: currentCategories,
  })

  const { osmNotesParam } = useOsmNotesParam()
  if (osmNotesParam) {
    categoryActiveLayerIds.push(osmNotesLayerId)
  }

  // active layer from datasets
  const { dataParam: selectedDatasetIds } = useDataParam()
  const regionDatasets = useRegionDatasets()
  const datasetsActiveLayerIds =
    regionDatasets
      .filter((dataset) => dataset.inspector.enabled)
      .filter((dataset) => selectedDatasetIds?.includes(dataset.id))
      .map((dataset) =>
        dataset.layers.map((layer) => createDatasetSourceLayerKey(dataset.id, layer.id)),
      )
      .flat() || []

  return [...categoryActiveLayerIds, ...datasetsActiveLayerIds]
}
