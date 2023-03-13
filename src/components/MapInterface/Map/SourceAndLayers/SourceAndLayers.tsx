import {
  getSourceData,
  getStyleData,
  getTopicData,
} from '@components/MapInterface/mapData'
import { debugLayerStyles } from '@components/MapInterface/mapData/topicsMapData/mapboxStyles/debugLayerStyles'
import { flatConfigTopics } from '@components/MapInterface/mapStateConfig/utils/flatConfigTopics'
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
export const SourceAndLayers: React.FC = () => {
  const { useDebugLayerStyles } = useMapDebugState()
  const { config: configThemesTopics, theme: themeId } =
    useSearch<LocationGenerics>()
  const currentTheme = configThemesTopics?.find((th) => th.id === themeId)
  if (!configThemesTopics || !currentTheme) return null

  // Sources and layers are based on topics. Themes don't change them; they just duplicate them.
  // Therefore, we look at a flattened topics list for this component.
  const configTopics = flatConfigTopics(configThemesTopics)

  const layerOrder = {
    symbol: 'housenumber',
    circle: 'housenumber',
    line: 'place-hamlet',
    fill: 'waterway',
    heatmap: 'waterway',
  }
  return (
    <>
      {configTopics.map((topicConfig) => {
        // We neet look at the currentThemeConfig and currentTopicConfig here…
        // - otherwise the visbility is not based on the theme-topics.
        // - and otherwise the visibility is based on the first topic of our flat list, not the current.
        const currTopicConfig = currentTheme.topics.find(
          (t) => t.id === topicConfig.id
        )
        if (!currTopicConfig) return null

        const curTopicData = getTopicData(topicConfig.id)
        const sourceData = getSourceData(curTopicData?.sourceId)

        // One source can be used by multipe topics, so we need to make the key source-topic-specific.
        // TODO we should try to find a better way for this…
        //  (and first find out if it's a problem at all)
        const sourceId = `source:${sourceData.id}--topic:${topicConfig.id}--tiles`

        return (
          <Source
            key={sourceId}
            id={sourceId}
            type="vector"
            tiles={[sourceData.tiles]}
            minzoom={8}
            maxzoom={22}
          >
            {topicConfig.styles.map((styleConfig) => {
              const styleData = getStyleData(curTopicData, styleConfig.id)
              // A style is visible when
              // … the theme is active (handled above) AND
              // … the topic is active AND
              // … the style is active (which includes 'default' via the config initialization)
              const visibility = layerVisibility(
                currTopicConfig.active && styleConfig.active
              )

              return styleData?.layers.map((layer) => {
                const layerId = createSourceTopicStyleLayerKey(
                  sourceData.id,
                  topicConfig.id,
                  styleConfig.id,
                  layer.id
                )
                const layout =
                  layer.layout === undefined
                    ? visibility
                    : { ...visibility, ...layer.layout }

                const filter = specifyFilters(
                  layer.filter,
                  styleData.interactiveFilters,
                  styleConfig.filters
                )

                // Use <DebugMap> to setUseDebugLayerStyles
                const layerPaint =
                  useDebugLayerStyles &&
                  debugLayerStyles({
                    source: sourceId,
                    sourceLayer: layer['source-layer'],
                  }).find((l) => l.type === layer.type)?.paint
                const layerProps = {
                  id: layerId,
                  type: layer.type,
                  source: sourceId,
                  beforeId: layerOrder[layer.type],
                  'source-layer': layer['source-layer'],
                  layout: layout,
                  filter: filter,
                  paint: layerPaint || (layer.paint as any),
                  ...(!!layer.minzoom && { minzoom: layer.minzoom }),
                  ...(!!layer.maxzoom && { maxzoom: layer.maxzoom }),
                }

                // The verification style layer in Mapbox Studio has to include this string
                const isVerificationStatusLayer =
                  layer.id.search('verification-status') != -1

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
