import { MapDataVisLayer, TopicIds } from '@components/MapInterface/mapData'
import { useMapDebugState } from '@components/MapInterface/mapStateInteraction/useMapDebugState'
import { isDev } from '@components/utils'
import React from 'react'
import { LegendDebugInfoLayerStyle } from './LegendDebugInfoLayerStyle'

type Props = {
  topicId: TopicIds
  styleDataLayers: MapDataVisLayer[] | undefined
}

export const LegendDebugInfoTopicLayerConfig: React.FC<Props> = ({ topicId, styleDataLayers }) => {
  const { showDebugInfo } = useMapDebugState()

  if (!isDev || !showDebugInfo) return null

  return (
    <LegendDebugInfoLayerStyle
      title={`Debug info: All layer and their styles for topic "${topicId}" (since topic config does not specify layers (yet or by design))`}
      layers={styleDataLayers}
    />
  )
}
