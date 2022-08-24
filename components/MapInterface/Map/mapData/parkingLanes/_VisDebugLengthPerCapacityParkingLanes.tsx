import React from 'react'
import { Layer } from 'react-map-gl'
import { useStore } from 'zustand'
import { useQuery, useStoreMap } from '../../../store'
import { layerVisibility, scopedId } from '../../utils'

export const VisDebugLengthPerCapacityParkingLanes: React.FC = () => {
  const topicKey = 'parking' // TODO das ist nur testweise so, sollte später nicht nötig sein zu definieren

  const {
    values: { selectedStyles: selectedTopics },
  } = useQuery()
  const { selectedVis } = useStore(useStoreMap)

  const scope = 'debugLengthPerCapacity'
  const visible =
    !!selectedTopics &&
    selectedTopics.includes(topicKey) &&
    selectedVis === scope

  const visibility = layerVisibility(visible)

  return (
    <>
      <Layer
        id={scopedId(scope, 'vts_pl')}
        type="line"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={visibility}
        filter={['all', ['>', 'length_per_capacity', 5]]}
        paint={{ 'line-width': 4, 'line-color': '#e7ffba' }}
      />
      <LayerHighlightParkingLanes scope={scope} visible={visible} />
      <Layer
        id={scopedId(scope, 'vts_pl_label')}
        type="symbol"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={{
          ...visibility,
          'text-field': '{length_per_capacity}',
          'symbol-placement': 'line-center',
        }}
        paint={{
          'text-halo-color': '#c300ff',
          'text-halo-width': 2,
        }}
      />
    </>
  )
}
