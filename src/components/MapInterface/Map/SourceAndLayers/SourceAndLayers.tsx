import {
  getMapDataSource,
  getMapDataTopic,
  getMapDataTopicStyle,
} from '@components/MapInterface/mapData'
import { flatConfigTopics } from '@components/MapInterface/mapStateConfig/utils/flatConfigTopics'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { layerVisibility } from '../utils'
import { LayerHighlightParkingLanes } from './LayerHighlightInspectorCalculator'
import { specifyFilters } from './utils'

export const SourceAndLayers: React.FC = () => {
  const { config: configThemesTopics } = useSearch<LocationGenerics>()
  if (!configThemesTopics) return null

  // Sources and layers are based on topics. Themes don't change them; they just duplicate them.
  // Therefore, we look at a flattened topics list for this component.
  const configTopics = flatConfigTopics(configThemesTopics)

  return (
    <>
      {configTopics.map((topicConfig) => {
        const topicData = getMapDataTopic(topicConfig.id)
        const sourceData = getMapDataSource(topicData?.sourceId)

        if (!topicConfig || !sourceData || !topicData) return null

        // One source can be used by multipe topics, so we need to make the key source-topic-specific.
        // TODO we should try to find a better way for this…
        //  (and first find out if it's a problem at all)
        const sourceId = `${sourceData.id}_${topicConfig.id}_tiles`

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
              const styleData = getMapDataTopicStyle(topicData, styleConfig.id)
              // A style is visible when
              // … the topic is active AND
              // … the style is active (which includes 'default')
              const visibility = layerVisibility(
                topicConfig.active && styleConfig.active
              )

              return styleData?.layers.map((layer) => {
                const layerId = `${sourceData.id}--${topicConfig.id}--${styleConfig.id}--${layer.id}`
                const layout =
                  layer.layout === undefined
                    ? visibility
                    : { ...visibility, ...layer.layout }

                const filter = specifyFilters(
                  layer.filter,
                  styleData.interactiveFilters,
                  styleConfig.filters
                )

                return (
                  <>
                    <LayerHighlightParkingLanes
                      sourceId={sourceId}
                      sourceLayer={layer['source-layer']}
                    />
                    <Layer
                      key={layerId}
                      id={layerId}
                      type={layer.type}
                      source={sourceId}
                      source-layer={layer['source-layer']}
                      {...(!!layer.minzoom && { minzoom: layer.minzoom })}
                      {...(!!layer.maxzoom && { maxzoom: layer.maxzoom })}
                      layout={layout}
                      filter={filter}
                      paint={layer.paint as any} // TODO Typescript
                    />
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
