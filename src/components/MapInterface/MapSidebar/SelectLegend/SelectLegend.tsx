import { clsx } from 'clsx'
import React from 'react'
import {
  MapDataStyle,
  MapDataStyleLegend,
  TopicIds,
  TopicStyleIds,
  TopicStyleLegendIds,
} from '../../mapData'
import { createTopicStyleKey, createTopicStyleLegendKey } from '../../utils'
import { LegendDebugInfoLayerStyle, LegendDebugInfoTopicLayerConfig } from './LegendDebugInfo'
import { LegendIconArea, LegendIconCircle, LegendIconLine, LegendIconTypes } from './LegendIcons'
import { LegendNameDesc } from './LegendNameDesc'

type Props = { topicId: TopicIds; styleData: MapDataStyle }

export const SelectLegend: React.FC<Props> = ({ topicId, styleData }) => {
  const legends = styleData?.legends?.filter((l) => l.id !== 'ignore' && l.name !== null)
  // Guard: Hide UI when no legends present for active style
  if (!styleData || !legends?.length) {
    return (
      <section className="relative">
        <LegendDebugInfoTopicLayerConfig topicId={topicId} styleDataLayers={styleData?.layers} />
      </section>
    )
  }

  const handleClick = (
    topicId: TopicIds,
    styleId: TopicStyleIds,
    legendId: TopicStyleLegendIds,
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
    const { type, color, width, dasharray } = legend.style
    return iconByStyle({ type, color, width, dasharray })
  }

  const iconByStyle = ({
    type,
    color,
    width,
    dasharray,
  }: {
    type: LegendIconTypes
    color: MapDataStyleLegend['style']['color']
    width?: MapDataStyleLegend['style']['width']
    dasharray?: MapDataStyleLegend['style']['dasharray']
  }) => {
    switch (type) {
      case 'line':
        return (
          <LegendIconLine color={color} width={width || 4} strokeDasharray={dasharray?.join(',')} />
        )
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
    <section className="relative mt-1 pt-0.5">
      <fieldset>
        <legend className="sr-only">Legende</legend>
        <div className="space-y-1">
          {legends.map((legendData) => {
            // TODO: TS: This should be specified at the source…
            const legendDataId = legendData.id as TopicStyleLegendIds
            if (legendDataId === 'ignore') return null

            const scope = createTopicStyleKey(topicId, styleData.id)
            const key = createTopicStyleLegendKey(topicId, styleData.id, legendDataId)

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
                <div className="h-5 w-5 flex-none">{iconFromLegend(legendData)}</div>
                <div className="flex h-5 items-center">
                  <input
                    id={key}
                    name={scope}
                    type="checkbox"
                    className="sr-only"
                    defaultChecked={active}
                    disabled={disabled}
                    onChange={() => interactive && handleClick(topicId, styleData.id, legendDataId)}
                    value={key}
                  />
                </div>
                <LegendNameDesc name={legendData.name} desc={legendData.desc} />
              </label>
            )
          })}
          <LegendDebugInfoLayerStyle
            title={`Debug info: All layer and their styles for topic "${topicId}" (since topic config does not specify layers (yet or by design))`}
            layers={styleData.layers}
          />
        </div>
      </fieldset>
    </section>
  )
}
