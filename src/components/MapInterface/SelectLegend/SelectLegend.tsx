import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import { clsx } from 'clsx'
import React from 'react'
import {
  getStyleData,
  MapDataStyleLegend,
  TopicIds,
  TopicStyleIds,
  TopicStyleLegendIds,
} from '../mapData'
import { createTopicStyleKey, createTopicStyleLegendKey } from '../utils'
import { LegendDebugInfoLayerStyle, LegendDebugInfoTopicLayerConfig } from './LegendDebugInfo'
import { LegendIconArea, LegendIconCircle, LegendIconLine, LegendIconTypes } from './LegendIcons'

type Props = { scopeTopicId: TopicIds }

export const SelectLegend: React.FC<Props> = ({ scopeTopicId }) => {
  const { config: configThemesTopics, theme: themeId } = useSearch<LocationGenerics>()
  const topicConfig = configThemesTopics
    ?.find((th) => th.id === themeId)
    ?.topics.find((t) => t.id === scopeTopicId)

  // Guard: Hide UI for inactive topics
  if (!topicConfig?.active) return null

  // Guard: One active style config
  const styleConfig = topicConfig.styles.find((s) => s.active)
  if (!styleConfig) return null

  const styleData = getStyleData(topicConfig.id, styleConfig.id)
  const legends = styleData?.legends?.filter((l) => l.id !== 'ignore' && l.name !== null)
  // Guard: Hide UI when no legends present for active style
  // (but vor isDev, give us a helper box to fix the config)
  if (!styleData || !legends?.length) {
    return (
      <section className="relative">
        <LegendDebugInfoTopicLayerConfig
          legends={styleData?.legends}
          topicId={topicConfig.id}
          styleDataLayers={styleData?.layers}
        />
      </section>
    )
  }

  const handleClick = (
    topicId: TopicIds,
    styleId: TopicStyleIds,
    legendId: TopicStyleLegendIds
  ) => {
    console.log('not implemented,yet', { topicId, styleId, legendId })
  }

  const iconFromLegend = (legend: MapDataStyleLegend) => {
    if (!legend?.style?.type && !legend?.style?.color) {
      console.warn('pickIconFromLegend: missing data', {
        type: legend?.style?.type,
        style: legend?.style?.color,
      })
      return null
    }
    const { type, color, dasharray } = legend.style
    return iconByStyle({ type, color, dasharray })
  }

  const iconByStyle = ({
    type,
    color,
    dasharray,
  }: {
    type: LegendIconTypes
    color: string
    dasharray?: number[]
  }) => {
    switch (type) {
      case 'line':
        return <LegendIconLine color={color} width={4} strokeDasharray={dasharray?.join(',')} />
      case 'border':
        return (
          <div className="relative h-full w-full">
            <div className="absolute inset-0.5 z-10">
              <LegendIconLine color="white" width={4} strokeDasharray={dasharray?.join(',')} />
            </div>
            <div className="absolute inset-0 z-0">
              <LegendIconLine color={color} width={7} strokeDasharray={dasharray?.join(',')} />
            </div>
          </div>
        )
      case 'circle':
        return <LegendIconCircle color={color} />
      case 'fill':
        return <LegendIconArea color={color} />
      default:
        return <>TODO</>
    }
  }

  return (
    <section className="relative mt-1 px-2 pt-0.5">
      <fieldset>
        <legend className="sr-only">Legende</legend>
        <div className="space-y-1">
          {legends.map((legendData) => {
            // TODO: TS: This should be specified at the source…
            const legendDataId = legendData.id as TopicStyleLegendIds
            if (legendDataId === 'ignore') return null

            const scope = createTopicStyleKey(topicConfig.id, styleConfig.id)
            const key = createTopicStyleLegendKey(topicConfig.id, styleConfig.id, legendDataId)

            const active = true // TODO
            const disabled = false // TODO
            const interactive = false // TODO legendData.layers !== null

            return (
              <label
                htmlFor={key}
                className={clsx('group relative flex items-center', {
                  'cursor-pointer': interactive,
                })}
                key={key}
              >
                <div className="ml-3 h-5 w-5 flex-none">{iconFromLegend(legendData)}</div>
                <div className="flex h-5 items-center">
                  <input
                    id={key}
                    name={scope}
                    type="checkbox"
                    className="sr-only"
                    defaultChecked={active}
                    disabled={disabled}
                    onChange={() =>
                      interactive && handleClick(topicConfig.id, styleConfig.id, legendDataId)
                    }
                    value={key}
                  />
                </div>
                <div
                  className="ml-2.5 flex min-h-[1.75rem] items-center text-sm font-medium leading-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: legendData.name }}
                />
              </label>
            )
          })}
          <LegendDebugInfoLayerStyle
            title={`Debug info: All layer and their styles for topic "${topicConfig.id}" (since topic config does not specify layers (yet or by design))`}
            layers={styleData.layers}
          />
        </div>
      </fieldset>
    </section>
  )
}
