import { Layer } from 'react-map-gl'
import { useStore } from 'zustand'
import { useQuery, useStoreMap } from '../../../store'
import { layerVisibility, scopedId } from '../../utils'
import { mapDataConfig } from '../mapDataConfig.const'
import { LayerHighlightParkingLanes } from '../SourceAndLayers/LayerHighlightInspectorCalculator'
import { LayerLabelParkingLanes } from './LayerLabelParkingLanes'

export const VisPresenceParkingLanes = () => {
  const topicKey = 'parking' // TODO das ist nur testweise so, sollte später nicht nötig sein zu definieren

  const {
    values: { selectedTopicIds },
  } = useQuery()
  // const { selectedVis } = useStore(useStoreMap)

  const scope = 'presence'

  const visible = !!selectedTopicIds && selectedTopicIds.includes('parking') //&&
  // selectedVis === scope
  const visibility = layerVisibility(visible)

  const topicData = mapDataConfig.topics.find((t) => t.id === topicKey)
  const sourceData = mapDataConfig.sources.find(
    (s) => topicData && s.id === topicData.sourceId
  )
  if (!topicData || !sourceData) return null

  const sourceId = `${sourceData.id}_tiles`

  return (
    <>
      {topicData.styles.map((style) =>
        style.layers.map((layer) => {
          const layerId = `${sourceData.id}--${topicData.id}--${style.id}--${layer.id}`
          console.log('test', { layerId, layer })
          const mergedLayout =
            layer.layout === undefined
              ? visibility
              : { ...visibility, ...layer.layout }
          return (
            <Layer
              key={layerId}
              id={layerId}
              type={layer.type}
              source={sourceId}
              source-layer={layer['source-layer']}
              layout={mergedLayout}
              filter={layer.filter}
              paint={layer.paint as any} // TODO Typescript
            />
          )
        })
      )}
      <LayerHighlightParkingLanes scope={scope} visible={visible} />
      <LayerLabelParkingLanes scope={scope} visible={visible} />
    </>
  )
}
