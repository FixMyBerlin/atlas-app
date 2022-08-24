import { useEffect } from 'react'
import { Layer } from 'react-map-gl'
import { useStore } from 'zustand'
import { useQuery, useStoreMap } from '../../../store'
import { layerVisibility } from '../../utils'
import { mapDataConfig } from '../mapDataConfig.const'
import { LayerHighlightParkingLanes } from '../SourceAndLayers/LayerHighlightInspectorCalculator'
import { LayerLabelParkingLanes } from './LayerLabelParkingLanes'

export const layerIdToPlaceBackgroundsBefore = 'vts_pl'

export const VisDefaultParkingLanes = () => {
  const topicKey = 'parking' // TODO das ist nur testweise so, sollte später nicht nötig sein zu definieren

  const {
    values: { selectedTopicIds },
  } = useQuery()
  const { addInteractiveLayerIds, removeInteractiveLayerIds } =
    useStore(useStoreMap)

  const scope = 'default'
  const visible = !!selectedTopicIds && selectedTopicIds.includes(topicKey) //&&
  // selectedVis === scope
  const visibility = layerVisibility(visible)

  // TODO this needs to be refactored out into some hook.
  // Something like const [visiblilty, xxx] = useSourceActivation('unfallatlas', selectedTopicIds)
  // useEffect(() => {
  //   const allowedInteractiveLayerIds = [
  //     layerIdToPlaceBackgroundsBefore,
  //     'vts_pl_no',
  //     'vts_pl_all_other',
  //   ]
  //   visibility === 'visible'
  //     ? addInteractiveLayerIds(allowedInteractiveLayerIds)
  //     : removeInteractiveLayerIds(allowedInteractiveLayerIds)
  // }, [addInteractiveLayerIds, removeInteractiveLayerIds, visibility])

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
          const layerId = `${sourceData.id}_${topicData.id}_${style.id}_${layer.id}`
          console.log('test', { layerId, layer })
          return (
            <Layer
              key={layerId}
              id={layerId}
              type={layer.type}
              source={sourceId}
              source-layer={layer['source-layer']}
              layout={visibility}
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
