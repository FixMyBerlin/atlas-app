import { createTopicStyleKey } from '@/components/MapInterface/utils'
import { useStoreMap } from '@/components/MapInterface/store'
import { useQuery } from '@/components/MapInterface/store/geschichte'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { useStore } from 'zustand'
import { layerVisibility } from '../../utils'
import { mapDataConfig } from '../mapDataConfig.const'
import { specifyFilters } from './utils'

export const SourceAndLayers: React.FC = () => {
  const {
    values: {
      selectedTopicIds,
      selectedStyleKeys,
      selectedStylesFilterOptionKeys,
    },
  } = useQuery()

  const topicIds = mapDataConfig.topics.map((t) => t.id)

  return (
    <>
      {topicIds.map((topicId) => {
        const topic = mapDataConfig.topics.find((t) => t.id === topicId)
        const source = mapDataConfig.sources.find(
          (s) => topic && s.id === topic.sourceId
        )

        if (!topic || !source) return null

        const sourceId = `${source.id}_tiles`

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
            tiles={[source.tiles]}
            minzoom={8}
            maxzoom={22}
          >
            {topic.styles.map((style) => {
              // A style is visible when
              // … the topic is active AND
              // … the style is active OR
              // … the style is default (since we do not add topics with just one style to the url/store)
              const visible =
                !!selectedTopicIds &&
                selectedTopicIds.includes(topicId) &&
                style.id === 'default'
                  ? true
                  : selectedStyleKeys.includes(
                      createTopicStyleKey(topicId, style.id)
                    )

              const visibility = layerVisibility(visible)

              return style.layers.map((layer) => {
                const layerId = `${source.id}--${topic.id}--${style.id}--${layer.id}`
                const layout =
                  layer.layout === undefined
                    ? visibility
                    : { ...visibility, ...layer.layout }

                const filter = specifyFilters(
                  style?.interactiveFilters,
                  layer.filter,
                  selectedStylesFilterOptionKeys
                )

                return (
                  <Layer
                    key={layerId}
                    id={layerId}
                    type={layer.type}
                    source={sourceId}
                    source-layer={layer['source-layer']}
                    {...(!!layer.minzoom && { minzoom: layer.minzoom })}
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
