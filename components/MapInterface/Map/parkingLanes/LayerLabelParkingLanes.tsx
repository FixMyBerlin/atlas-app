import { Layer } from 'react-map-gl'
import React from 'react'
import { StyleLayerLayoutVisibility } from '../utils'
import { ScopeForId } from '../utils/scopedId/types'
import { scopedId } from '../utils/scopedId/scopedId'

type Props = StyleLayerLayoutVisibility & ScopeForId

export const LayerLabelParkingLanes: React.FC<Props> = ({
  scope,
  visibility,
}) => {
  return (
    <Layer
      id={scopedId(scope, 'vts_pl_label')}
      type="symbol"
      source="vts_pl_tiles"
      source-layer="public.parking_segments"
      layout={{
        visibility,
        'text-field': '{capacity}',
        'symbol-placement': 'line-center',
      }}
      paint={{
        'text-halo-color': 'rgba(255, 255, 255, 1)',
        'text-halo-width': 1,
      }}
    />
  )
}
