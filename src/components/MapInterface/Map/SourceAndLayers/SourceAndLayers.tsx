import {
  getMapDataTopic,
  getMapDataTopicStyle,
  mapDataConfig,
} from '@components/MapInterface/mapData'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { layerVisibility } from '../utils'

export const SourceAndLayers: React.FC = () => {
  const { config: configTopics } = useSearch<LocationGenerics>()

  if (!configTopics) return null

  return (
    <>
      {configTopics.map((topicConfig) => {
        const topicData = getMapDataTopic(topicConfig.id)
        const sourceData = mapDataConfig.sources.find(
          (s) => s.id === topicData?.sourceId
        )

        if (!topicConfig || !sourceData || !topicData) return null

        // One source can be used by multipe topics, so we need to make the key source-topic-specific.
        // TODO we should try to find a better way for this…
        //  (and first find out if it's a problem at all)
        const sourceId = `${sourceData.id}_${topicConfig.id}_tiles`

        // TODO Inspector + Calculator / InteractiveLayerIDs
        // Ich habe sie auf Ebene Layer gespeichert.
        // Aktiv werden müssen sie aber auf Ebene Map.
        // Ich muss also von hier, abhängig von der visibility, die interactive Layers setzen
        // UND dann, wenn sie benötigt werden, dynamisch auch die Layer aktivieren
        // Diese müssen dann abhängig sein vom type (line/point).
        // Einfacher ist erstmal, sie pro VIS zu duplizieren, daher kommen sie auf diese Ebene

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

                // TODO: We need to refactor the helper method.
                // Right now, it expect the filter key which it then splits again. Our config does not have this key.
                // In addition, I am not sure if the case of multipe filters is supported, yet;
                // It might be, but it looks like we just put all filter key into all filters…
                // Which only worked, because we only have one filter ATM
                const filter = layer.filter || ['all']
                // const selectedStylesFilterOptionKeys = style.filters.map() TODO
                // const filter = specifyFilters(
                //   styleData?.interactiveFilters,
                //   layer.filter,
                //   selectedStylesFilterOptionKeys
                // )

                return (
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
                )
              })
            })}
          </Source>
        )
      })}
    </>
  )
}
