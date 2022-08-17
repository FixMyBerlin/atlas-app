import React from 'react'
import { Layer } from 'react-map-gl'
import { useStore } from 'zustand'
import { useStoreMap } from '../../store/useStoreMap'
import { layerVisibility } from '../utils/visibility'
import { LayerHighlightParkingLanes } from './LayerHighlightParkingLanes'
import { LayerLabelParkingLanes } from './LayerLabelParkingLanes'

export const layerIdToPlaceBackgroundsBefore = 'vts_pl'

export const VisDefaultParkingLanes = () => {
  const { selectedSources, selectedVis } = useStore(useStoreMap)

  const scope = 'default'
  const visibility = layerVisibility(
    selectedSources.includes('parkingLanes') && selectedVis === scope
  )

  return (
    <>
      <Layer
        id={layerIdToPlaceBackgroundsBefore}
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
        paint={{ 'line-width': 4, 'line-color': 'rgba(110, 165, 9, 1)' }}
      />
      <Layer
        id="vts_pl_no"
        type="line"
        source="vts_pl_tiles"
        source-layer="public.parking_segments"
        layout={{ visibility }}
        filter={[
          'all',
          ['in', 'orientation', 'no', 'no_parking', 'no_stopping'],
        ]}
        paint={{
          'line-width': 2,
          'line-color': 'rgba(233, 171, 148, 1)',
        }}
      />
      <Layer
        id="vts_pl_all_other"
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
          'line-width': 3,
          'line-color': 'rgba(153, 164, 241, 1)',
        }}
      />
      <LayerHighlightParkingLanes scope={scope} visibility={visibility} />
      <LayerLabelParkingLanes scope={scope} visibility={visibility} />
    </>
  )
}
