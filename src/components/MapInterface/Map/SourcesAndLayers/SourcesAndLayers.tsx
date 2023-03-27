import {
  getSourceData,
  getStyleData,
  getTopicData,
  TBeforeIds,
} from '@components/MapInterface/mapData'
import { debugLayerStyles } from '@components/MapInterface/mapData/topicsMapData/mapboxStyles/debugLayerStyles'
import { flattenConfigTopics } from '@components/MapInterface/mapStateConfig/utils/flattenConfigTopics'
import { useMapDebugState } from '@components/MapInterface/mapStateInteraction/useMapDebugState'
import { createSourceTopicStyleLayerKey } from '@components/MapInterface/utils'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { layerVisibility } from '../utils'
import { LayerHighlight } from './LayerHighlight'
import { LayerVerificationStatus } from './LayerVerificationStatus'
import { specifyFilters } from './utils'

// We add source+layer map-components for all topics of the given confic.
// We then toggle the visibility of the layer base on state.
// We also use this visbility to add/remove interactive layers.
export const SourcesAndLayers: React.FC = () => {
  const { useDebugLayerStyles } = useMapDebugState()
  const {
    theme: themeId,
    config: configThemesTopics,
    bg: selectedBackgroundId,
  } = useSearch<LocationGenerics>()
  const currentTheme = configThemesTopics?.find((th) => th.id === themeId)
  if (!configThemesTopics || !currentTheme) return null

  // Sources and layers are based on topics. Themes don't change them; they just duplicate them.
  // Therefore, we look at a flattened topics list for this component.
  const flatConfigTopics = flattenConfigTopics(configThemesTopics)

  // We place our layers between given Maptiler Layer IDs:
  // Key: LayerType – we group our data based on layer type.
  // Value: Maptiler Layer ID that our layers are placed on top of.
  // BUT: We only use this for our "default" background.
  //    For custom raster backgrounds we place all our data on top.
  const layerOrder: Record<string, TBeforeIds> = {
    symbol: 'housenumber', // Icon + Label
    circle: 'housenumber', // Points
    heatmap: 'housenumber',
    line: 'boundary_country',
    fill: 'landuse',
  }

  return (
    <>
      {flatConfigTopics.map((flatTopicConfig) => {
        // We neet look at the currentThemeConfig and currentTopicConfig here…
        // - otherwise the visbility is not based on the theme-topics.
        // - and otherwise the visibility is based on the first topic of our flat list, not the current.
        const currTopicConfig = currentTheme.topics.find((t) => t.id === flatTopicConfig.id)
        if (!currTopicConfig) return null

        const curTopicData = getTopicData(flatTopicConfig.id)
        const sourceData = getSourceData(curTopicData?.sourceId)

        // One source can be used by multipe topics, so we need to make the key source-topic-specific.
        // TODO we should try to find a better way for this…
        //  (and first find out if it's a problem at all)
        const sourceId = `source:${sourceData.id}--topic:${flatTopicConfig.id}--tiles`

        return (
          <Source
            key={sourceId}
            id={sourceId}
            type="vector"
            tiles={[sourceData.tiles]}
            minzoom={sourceData.minzoom || 8}
            maxzoom={sourceData.maxzoom || 22}
          >
            {flatTopicConfig.styles.map((styleConfig) => {
              const styleData = getStyleData(curTopicData, styleConfig.id)
              // A style is visible when
              // … the theme is active (handled above) AND
              // … the current topic is active AND
              // … the current topic's style is active (which includes 'default' via the config initialization)
              const currStyleConfig = currTopicConfig.styles.find((s) => s.id === styleConfig.id)
              const visibility = layerVisibility(
                (currTopicConfig.active && currStyleConfig?.active) || false
              )

              return styleData?.layers.map((layer) => {
                const layerId = createSourceTopicStyleLayerKey(
                  sourceData.id,
                  flatTopicConfig.id,
                  styleConfig.id,
                  layer.id
                )
                const layout =
                  layer.layout === undefined ? visibility : { ...visibility, ...layer.layout }

                // Use ?debugMap=true and <DebugMap> to setUseDebugLayerStyles
                const layerFilter = useDebugLayerStyles
                  ? ['all']
                  : specifyFilters(layer.filter, styleData.interactiveFilters, styleConfig.filters)

                // Use ?debugMap=true and <DebugMap> to setUseDebugLayerStyles
                const layerPaint = useDebugLayerStyles
                  ? debugLayerStyles({
                      source: sourceId,
                      sourceLayer: layer['source-layer'],
                    }).find((l) => l.type === layer.type)?.paint
                  : (layer.paint as any)

                // For all custom background (non 'default'), set beforeId=undefined which puts them at the top
                // If a specific topic.beforeId is given (which might be `undefined`), take that
                // … otherwise pick the beforeId base on layer.type.
                const beforeId =
                  selectedBackgroundId === 'default'
                    ? 'beforeId' in curTopicData
                      ? curTopicData.beforeId
                      : layerOrder[layer.type]
                    : undefined

                const layerProps = {
                  id: layerId,
                  type: layer.type,
                  source: sourceId,
                  beforeId,
                  'source-layer': layer['source-layer'],
                  layout: layout,
                  filter: layerFilter,
                  paint: layerPaint,
                }

                // The verification style layer in Mapbox Studio has to include this string
                const isVerificationStatusLayer = layer.id.search('verification-status') != -1

                return (
                  <>
                    {isVerificationStatusLayer ? (
                      <LayerVerificationStatus {...layerProps} />
                    ) : (
                      <Layer {...layerProps} />
                    )}
                    <LayerHighlight {...layerProps} />
                  </>
                )
              })
            })}
          </Source>
        )
      })}
    </>
  )
}
