import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import {
  getStyleData,
  MapDataVisLayer,
  TopicIds,
  TopicStyleIds,
  TopicStyleLegendIds,
} from '../mapData'
import { createTopicStyleKey, createTopicStyleLegendKey } from '../utils'
import { LegendDebugInfo } from './LegendDebugInfo'
import { LegendIconCircle, LegendIconLine } from './LegendIcons'

type Props = { scopeTopicId: TopicIds }

export const SelectLegend: React.FC<Props> = ({ scopeTopicId }) => {
  const { config: configThemesTopics, theme: themeId } =
    useSearch<LocationGenerics>()
  const topicConfig = configThemesTopics
    ?.find((th) => th.id === themeId)
    ?.topics.find((t) => t.id === scopeTopicId)

  // Guard: Hide UI for inactive topics
  if (!topicConfig?.active) return null

  // Guard: One active style config
  const styleConfig = topicConfig.styles.find((s) => s.active)
  if (!styleConfig) return null

  // Guard: Hide UI when no legends present for active style
  const styleData = getStyleData(topicConfig.id, styleConfig.id)
  const legends = styleData?.legends?.filter(
    (l) => l.id !== 'ignore' && l.name !== null
  )
  if (!styleData || !legends) return null

  const handleClick = (
    topicId: TopicIds,
    styleId: TopicStyleIds,
    legendId: TopicStyleLegendIds
  ) => {
    console.log({ topicId, styleId, legendId })
  }

  const pickIcon = (layer: MapDataVisLayer[]) => {
    const styleLayer = layer[0]
    switch (styleLayer.type) {
      case 'line':
        return (
          <LegendIconLine
            color={styleLayer?.paint?.['line-color'] as string}
            width={4}
          />
        )
      case 'circle':
        return <LegendIconCircle />
      default:
        return <>TODO</>
    }
  }

  return (
    <section className="mt-1 rounded border px-2 py-2.5">
      <fieldset>
        <legend className="sr-only">Legende</legend>
        <div className="space-y-2.5">
          {legends.map((legendData) => {
            // TODO: TS: This should be specified at the source…
            const legendDataId = legendData.id as TopicStyleLegendIds
            if (legendDataId === 'ignore') return null

            const scope = createTopicStyleKey(topicConfig.id, styleConfig.id)
            const key = createTopicStyleLegendKey(
              topicConfig.id,
              styleConfig.id,
              legendDataId
            )

            const active = true // TODO
            const disabled = false // TODO
            const layers = styleData.layers.filter((layer) =>
              legendData.layers.includes(layer.id)
            )

            return (
              <label
                htmlFor={key}
                className="group relative flex cursor-pointer items-center"
                key={key}
              >
                <div className="h-5 w-5">{pickIcon(layers)}</div>
                <div className="flex h-5 items-center ">
                  <input
                    id={key}
                    name={scope}
                    type="checkbox"
                    className="sr-only"
                    defaultChecked={active}
                    disabled={disabled}
                    onChange={() =>
                      handleClick(topicConfig.id, styleConfig.id, legendDataId)
                    }
                    value={key}
                  />
                </div>
                <div className="ml-2.5 flex items-center text-sm font-medium text-gray-700">
                  {legendData.name}
                  <LegendDebugInfo
                    legendName={legendData.name || ''}
                    layers={layers}
                  />
                </div>
              </label>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}
