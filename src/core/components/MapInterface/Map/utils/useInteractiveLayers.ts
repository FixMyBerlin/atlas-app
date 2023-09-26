import { useRegionDatasets } from 'src/core/components/MapInterface/SelectDatasets/utils/useRegionDatasets'
import { getSourceData, getStyleData, getTopicData } from 'src/core/components/MapInterface/mapData'
import { ThemeConfig } from 'src/core/components/MapInterface/mapStateConfig'
import {
  createDatasetSourceLayerKey,
  createSourceTopicStyleLayerKey,
} from 'src/core/components/MapInterface/utils'
import { LocationGenerics } from 'src/TODO-MIRGRATE-REMOVE/routes'
import { useSearch } from '@tanstack/react-location'
import { osmNotesLayerId } from '../SourcesAndLayers/SourcesLayersOsmNotes'

type Props = { themes: ThemeConfig[] | undefined }

const collectInteractiveLayerIdsFromTheme = ({ themes }: Props) => {
  const interactiveLayerIds: string[] = []

  themes?.forEach((themeConfig) => {
    if (themeConfig.active === false) return

    return themeConfig?.topics?.forEach((topicConfig) => {
      const topicData = getTopicData(topicConfig.id)

      topicConfig.styles.forEach((styleConfig) => {
        const styleData = getStyleData(topicData, styleConfig.id)
        if (styleData.id === 'hidden') return
        if (styleConfig.active === false) return

        styleData.layers.forEach((layerConfig) => {
          // Only if `inspector.enabled` do we want to enable the layer (which enables the Inspector)
          const sourceData = getSourceData(topicData.sourceId)
          if (!sourceData.inspector.enabled) return

          const layerData = styleData.layers.find((l) => l.id === layerConfig.id)
          if (layerData?.interactive === false) return

          const layerKey = createSourceTopicStyleLayerKey(
            topicData.sourceId,
            topicConfig.id,
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
  // active layer from theme
  const { config: configThemes } = useSearch<LocationGenerics>()
  const currentThemes = configThemes?.filter((th) => th.active === true)

  const themeActiveLayerIds = collectInteractiveLayerIdsFromTheme({ themes: currentThemes })

  const { osmNotes } = useSearch<LocationGenerics>()
  if (osmNotes) {
    themeActiveLayerIds.push(osmNotesLayerId)
  }

  // active layer from datasets
  const { data: selectedDatasetIds } = useSearch<LocationGenerics>()
  const regionDatasets = useRegionDatasets()
  const datasetsActiveLayerIds =
    regionDatasets
      .filter((dataset) => dataset.inspector.enabled)
      .filter((dataset) => selectedDatasetIds?.includes(dataset.id))
      .map((dataset) =>
        dataset.layers.map((layer) => createDatasetSourceLayerKey(dataset.id, layer.id)),
      )
      .flat() || []

  return [...themeActiveLayerIds, ...datasetsActiveLayerIds]
}
