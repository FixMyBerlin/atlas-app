import React from 'react'
import { Map as MapGl, Source, Layer, NavigationControl } from 'react-map-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl from 'maplibre-gl'

export const Map: React.FC = () => {
  return null
  // <MapGl
  //   id="mainMap"
  //   initialViewState={{
  //     longitude: 13.4381,
  //     latitude: 52.47928,
  //     zoom: 16,
  //   }}
  //   hash
  //   style={{ width: '100%', height: 400 }}
  //   mapLib={maplibregl}
  //   mapStyle="https://api.maptiler.com/maps/basic/style.json?key=ECOoUBmpqklzSCASXxcu"
  // >
  //   <NavigationControl />

  //   <Source
  //     id="vts_pl_tiles"
  //     type="vector"
  //     tiles={[
  //       'https://vts.mapwebbing.eu/public.parking_segments/{z}/{x}/{y}.pbf',
  //     ]}
  //     minzoom={8}
  //     maxzoom={22}
  //   >
  //     <Layer
  //       id="vts_pl"
  //       type="line"
  //       source="vts_pl_tiles"
  //       source-layer="public.parking_segments"
  //       filter={[
  //         'all',
  //         [
  //           'in',
  //           'orientation',
  //           'half_on_kerb',
  //           'marked',
  //           'mixed',
  //           'parallel',
  //           'perpendicular',
  //           'street_side',
  //           'yes',
  //           'diagonal',
  //         ],
  //       ]}
  //       paint={{ 'line-width': 4, 'line-color': 'rgba(110, 165, 9, 1)' }}
  //     />
  //     <Layer
  //       id="vts_pl__highlight"
  //       type="line"
  //       source="vts_pl_tiles"
  //       source-layer="public.parking_segments"
  //       filter={['in', 'id', '']}
  //       paint={{ 'line-width': 6, 'line-color': 'rgba(146, 49, 154, 1)' }}
  //     />
  //     <Layer
  //       id="vts_pl_no"
  //       type="line"
  //       source="vts_pl_tiles"
  //       source-layer="public.parking_segments"
  //       filter={[
  //         'all',
  //         ['in', 'orientation', 'no', 'no_parking', 'no_stopping'],
  //       ]}
  //       paint={{
  //         'line-width': 2,
  //         'line-color': 'rgba(233, 171, 148, 1)',
  //       }}
  //     />
  //     <Layer
  //       id="vts_pl_label"
  //       type="symbol"
  //       source="vts_pl_tiles"
  //       source-layer="public.parking_segments"
  //       layout={{
  //         'text-field': '{capacity}',
  //         'symbol-placement': 'line-center',
  //       }}
  //       paint={{
  //         'text-halo-color': 'rgba(255, 255, 255, 1)',
  //         'text-halo-width': 1,
  //       }}
  //     />
  //     <Layer
  //       id="vts_pl_all_other"
  //       type="line"
  //       source="vts_pl_tiles"
  //       source-layer="public.parking_segments"
  //       filter={[
  //         'all',
  //         [
  //           '!in',
  //           'orientation',
  //           'no',
  //           'no_parking',
  //           'no_stopping',
  //           'separate',
  //           'half_on_kerb',
  //           'marked',
  //           'mixed',
  //           'parallel',
  //           'perpendicular',
  //           'street_side',
  //           'yes',
  //           'diagonal',
  //         ],
  //       ]}
  //       paint={{
  //         'line-width': 3,
  //         'line-color': 'rgba(153, 164, 241, 1)',
  //       }}
  //     />
  //   </Source>
  //   <Source
  //     id="vts_boundaries_tiles"
  //     type="vector"
  //     tiles={['https://vts.mapwebbing.eu/public.boundaries/{z}/{x}/{y}.pbf']}
  //     minzoom={8}
  //     maxzoom={22}
  //   >
  //     <Layer
  //       id="vts_boundaries"
  //       type="line"
  //       source="vts_boundaries_tiles"
  //       source-layer="public.boundaries"
  //       filter={['all', ['>=', 'admin_level', "'10'"]]}
  //       paint={{
  //         'line-width': 2,
  //         'line-color': 'rgba(215, 34, 34, 1)',
  //       }}
  //     />
  //   </Source>
  // </MapGl>
}
