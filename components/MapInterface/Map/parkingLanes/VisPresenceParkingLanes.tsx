import React from 'react'
import { Layer } from 'react-map-gl'
import { useStore } from 'zustand'
import { useQuery } from '../../store/geschichte'
import { useStoreMap } from '../../store/useStoreMap'
import { scopedId } from '../utils/scopedId/scopedId'
import { layerVisibility } from '../utils/visibility'
import { LayerHighlightParkingLanes } from './LayerHighlightParkingLanes'
import { LayerLabelParkingLanes } from './LayerLabelParkingLanes'

export const VisPresenceParkingLanes = () => {
  const {
    values: { selectedSources },
  } = useQuery()
  const { selectedVis } = useStore(useStoreMap)

  const scope = 'presence'
  const visibility = layerVisibility(
    !!selectedSources &&
      selectedSources.includes('parkingLanes') &&
      selectedVis === scope
  )

  return (
    <>
      <Layer
        id={scopedId(scope, 'vts_pl')}
        type="line"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={{ visibility }}
        filter={[
          'all',
          [
            'in',
            'orientation',
            'half_on_kerb',
            'marked',
            'mixed',
            'parallel',
            'perpendicular',
            'street_side',
            'yes',
            'diagonal',
          ],
        ]}
        paint={{ 'line-width': 4, 'line-color': '#e7ffba' }}
      />
      <Layer
        id={scopedId(scope, 'vts_pl_no')}
        type="line"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={{ visibility }}
        filter={[
          'all',
          ['in', 'orientation', 'no', 'no_parking', 'no_stopping'],
        ]}
        paint={{
          'line-width': 4,
          'line-color': '#ffc1aa',
        }}
      />
      <Layer
        id={scopedId(scope, 'vts_pl_all_other')}
        type="line"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={{ visibility }}
        filter={[
          'all',
          [
            '!in',
            'orientation',
            'no',
            'no_parking',
            'no_stopping',
            'separate',
            'half_on_kerb',
            'marked',
            'mixed',
            'parallel',
            'perpendicular',
            'street_side',
            'yes',
            'diagonal',
          ],
        ]}
        paint={{
          'line-width': 10,
          'line-color': '#ed0e0e',
        }}
      />
      <LayerHighlightParkingLanes scope={scope} visibility={visibility} />
      <LayerLabelParkingLanes scope={scope} visibility={visibility} />
    </>
  )
}
