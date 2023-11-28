import React from 'react'
import { isDev } from 'src/app/_components/utils/isEnv'
import { useMapDebugState } from 'src/app/regionen/[regionSlug]/_components/mapStateInteraction/useMapDebugState'
import { TopicIds } from '../../../mapData/mapData.const'
import { MapDataVisLayer } from '../../../mapData/types'
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
