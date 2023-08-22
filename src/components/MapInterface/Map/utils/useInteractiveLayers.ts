import { useRegionDatasets } from '@components/MapInterface/SelectDatasets/utils/useRegionDatasets'
import { getSourceData, getStyleData, getTopicData } from '@components/MapInterface/mapData'
import { ThemeConfig } from '@components/MapInterface/mapStateConfig'
import {
  createDatasetSourceLayerKey,
  createSourceTopicStyleLayerKey,
} from '@components/MapInterface/utils'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import { osmNotesLayerId } from '../SourcesAndLayers/SourcesLayersOsmNotes'

type Props = { theme: ThemeConfig | undefined }

const collectInteractiveLayerIdsFromTheme = ({ theme }: Props) => {
  const interactiveLayerIds: string[] = []

  theme?.topics?.forEach((topicConfig) => {
    // Guard: Only pick layer that are part of our current theme

    if (!theme?.topics.some((t) => t.id === topicConfig.id)) return
    const topicData = getTopicData(topicConfig.id)

    topicConfig.styles.forEach((styleConfig) => {
      const styleData = getStyleData(topicData, styleConfig.id)
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
          layerConfig.id
        )

        interactiveLayerIds.push(layerKey)
      })
    })
  })

  return interactiveLayerIds
}

export const useInteractiveLayers = () => {
  // active layer from theme
  const { config: configThemesTopics, theme: themeId } = useSearch<LocationGenerics>()
  const currentTheme = configThemesTopics?.find((th) => th.id === themeId)

  const themeActiveLayerIds = collectInteractiveLayerIdsFromTheme({ theme: currentTheme })

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
        dataset.layers.map((layer) => createDatasetSourceLayerKey(dataset.id, layer.id))
      )
      .flat() || []

  return [...themeActiveLayerIds, ...datasetsActiveLayerIds]
}
