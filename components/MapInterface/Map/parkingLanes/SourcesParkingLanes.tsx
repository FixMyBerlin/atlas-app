import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { Source } from 'react-map-gl'
import { VisDebugLengthPerCapacityParkingLanes } from './VisDebugLengthPerCapacityParkingLanes'
import { VisDefaultParkingLanes } from './VisDefaultParkingLanes'
import { VisPresenceParkingLanes } from './VisPresenceParkingLanes'

export const SourcesParkingLanes: React.FC = () => {
  // Order: Last defined <Layer> are on top
  return (
    <Source
      id="vts_pl_tiles"
      type="vector"
      tiles={[
        'https://vts.mapwebbing.eu/public.parking_segments/{z}/{x}/{y}.pbf',
      ]}
      minzoom={8}
      maxzoom={22}
    >
      <VisDefaultParkingLanes />
      <VisPresenceParkingLanes />
      <VisDebugLengthPerCapacityParkingLanes />
    </Source>
  )
}
