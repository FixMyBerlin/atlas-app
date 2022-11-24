/* eslint-disable react/no-unescaped-entities */
import {
  MapDataStyleLegend,
  MapDataVisLayer,
  TopicIds,
} from '@components/MapInterface/mapData'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import { isDev } from '@components/utils'
import React from 'react'
import { LegendDebugInfoLayerStyle } from './LegendDebugInfoLayerStyle'

type Props = {
  legends: MapDataStyleLegend[] | undefined | null
  topicId: TopicIds
  styleDataLayers: MapDataVisLayer[] | undefined
}

export const LegendDebugInfoTopicLayerConfig: React.FC<Props> = ({
  legends,
  topicId,
  styleDataLayers,
}) => {
  const { showDebugInfo } = useMapStateInteraction()

  if (!isDev || !showDebugInfo || !legends || !styleDataLayers) return null

  const allLegendLayers: string[] = []
  legends?.forEach((legend) => [...allLegendLayers, ...(legend?.layers || [])])
  // TODO DebuggingInfo — See comment below.
  // const layersThatAreMissingInLegend = styleDataLayers
  //   .map((layer) => layer.id)
  //   .filter((layerId) => !allLegendLayers.includes(layerId))

  return (
    <div className="bg-pink-300">
      <LegendDebugInfoLayerStyle
        title={`Debug info: All layer and their styles for topic "${topicId}" (since topic config does not specify layers (yet or by design))`}
        layers={styleDataLayers}
      />
      {/* TODO DebuggingInfo — Disabled for now.
          The idea was, to have all layers explicitly specified in the topic config.
          And this debug info should list those, that are not yet explicitly specified, so we can add them.
          However, it looks like it lists the wrong layers or maybe not all … — needs another close look. */}
      {/* {!!layersThatAreMissingInLegend.length && (
            <details className="prose">
              <summary>Review layers</summary>
              Those layers need to be added to one of the legend-layers array.
              Or to the dumping ground legend entry <code>ignore</code>.
              <pre>{layersThatAreMissingInLegend.join('\n')}</pre>
            </details>
          )} */}
    </div>
  )
}
