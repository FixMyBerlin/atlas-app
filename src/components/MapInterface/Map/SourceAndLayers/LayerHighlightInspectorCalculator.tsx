import React from 'react'
import { Layer } from 'react-map-gl'
import { useStore } from 'zustand'
import { useStoreMap } from '@/components/MapInterface/store/useStoreMap'
import { layerVisibility, scopedId, ScopeForId } from '../utils'

type Props = ScopeForId & { visible: boolean }

export const LayerHighlightParkingLanes: React.FC<Props> = ({
  scope,
  visible,
}) => {
  const { inspectorFeatures, calculatorFeatures } = useStore(useStoreMap)

  const inspectorIds = inspectorFeatures?.map((o) => o?.properties?.id) || []
  const calculatorIds = calculatorFeatures?.map((o) => o?.properties?.id) || []

  const visibility = layerVisibility(visible)

  return (
    <>
      <Layer
        id={scopedId(scope, 'vts_pl__inspector')}
        type="line"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={visibility}
        filter={['in', 'id', ...inspectorIds]}
        paint={{ 'line-width': 10, 'line-color': 'rgba(146, 49, 154, 1)' }}
      />
      <Layer
        id={scopedId(scope, 'vts_pl__calculator')}
        type="line"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={visibility}
        filter={['in', 'id', ...calculatorIds]}
        paint={{ 'line-width': 10, 'line-color': '#500657' }}
      />
    </>
  )
}
