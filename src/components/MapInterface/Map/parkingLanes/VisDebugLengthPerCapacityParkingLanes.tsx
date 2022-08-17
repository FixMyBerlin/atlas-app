import React from 'react'
import { Layer } from 'react-map-gl'
import { useStore } from 'zustand'
import { useStoreMap } from '../../store/useStoreMap'
import { scopedId } from '../utils/scopedId/scopedId'
import { layerVisibility } from '../utils/visibility'
import { LayerHighlightParkingLanes } from './LayerHighlightParkingLanes'

export const VisDebugLengthPerCapacityParkingLanes: React.FC = () => {
  const { selectedSources, selectedVis } = useStore(useStoreMap)

  const scope = 'debugLengthPerCapacity'
  const visibility = layerVisibility(
    selectedSources.includes('parkingLanes') && selectedVis === scope
  )

  return (
    <>
      <Layer
        id={scopedId(scope, 'vts_pl')}
        type="line"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={{ visibility }}
        filter={['all', ['>', 'length_per_capacity', 5]]}
        paint={{ 'line-width': 4, 'line-color': '#e7ffba' }}
      />
      <LayerHighlightParkingLanes scope={scope} visibility={visibility} />
      <Layer
        id={scopedId(scope, 'vts_pl_label')}
        type="symbol"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={{
          visibility,
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
