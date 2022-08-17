import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { useStore } from 'zustand'
import { useStoreMap } from '../../store'
import { getSourceVisibility } from '../utils'

export const SourcesBoundaries: React.FC = () => {
  const { selectedSources } = useStore(useStoreMap)
  const visibility = getSourceVisibility(selectedSources, 'boundaries')

  return (
    <Source
      id="vts_boundaries_tiles"
      type="vector"
      tiles={['https://vts.mapwebbing.eu/public.boundaries/{z}/{x}/{y}.pbf']}
      minzoom={8}
      maxzoom={22}
    >
      <Layer
        id="vts_boundaries"
        type="line"
        source="vts_boundaries_tiles"
        source-layer="public.boundaries"
        layout={{ visibility }}
        filter={['all', ['>=', 'admin_level', "'10'"]]}
        paint={{
          'line-width': 2,
          'line-color': 'rgba(215, 34, 34, 1)',
        }}
      />
    </Source>
  )
}
