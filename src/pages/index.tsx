import maplibregl from 'maplibre-gl'
import React, { useCallback } from 'react'
import {
  Layer,
  Map,
  MapProvider,
  NavigationControl,
  Source,
} from 'react-map-gl'
import { Layout } from '~/components/Layout'
import { BackgroundPicker } from '~/components/Map'
import { backgroundLayer } from '~/components/Map/BackgroundPicker/backgroundLayer.const'
// import { Map, BackgroundPicker } from '~/components/Map'

const IndexPage: React.FC = () => {
  // const mapRef = React.useRef<maplibregl.Map>(undefined)

  // console.log({ a: mapRef, usableBackgroundLayer })
  // const onMapLoad = useCallback(() => {
  //   const map = mapRef.current
  //   if (!map) return

  //   map.on('idle', () => {
  //     // We only work with those layers, that where added to the map
  //     usableBackgroundLayer = Object.keys(backgroundLayer).filter((layerId) =>
  //       map.getLayer(layerId)
  //     )
  //   })
  //   console.log({
  //     b: mapRef,
  //     usableBackgroundLayer,
  //     x: Object.keys(backgroundLayer).filter((layerId) =>
  //       console.log({ map, xy: map.getLayer(layerId), layerId })
  //     ),
  //   })
  // }, [mapRef])

  return (
    <Layout>
      <div className="flex flex-row gap-4">
        {/* <MapProvider>
          <Map />
          <BackgroundPicker />
        </MapProvider> */}
        <MapProvider>
          <Map
            id="mainMap"
            // ref={mapRef as any /* No idea why this is complaining… */}
            // onLoad={onMapLoad}
            initialViewState={{
              longitude: 13.4381,
              latitude: 52.47928,
              zoom: 16,
            }}
            hash
            style={{ width: '100%', height: 400 }}
            mapLib={maplibregl}
            mapStyle="https://api.maptiler.com/maps/basic/style.json?key=ECOoUBmpqklzSCASXxcu"
          >
            <NavigationControl showCompass={false} />
            <Source
              id="vts_pl_tiles"
              type="vector"
              tiles={[
                'https://vts.mapwebbing.eu/public.parking_segments/{z}/{x}/{y}.pbf',
              ]}
              minzoom={8}
              maxzoom={22}
            >
              <Layer
                id="vts_pl"
                type="line"
                source="vts_pl_tiles"
                source-layer="public.parking_segments"
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
                paint={{
                  'line-width': 4,
                  'line-color': 'rgba(110, 165, 9, 1)',
                }}
              />
              <Layer
                id="vts_pl__highlight"
                type="line"
                source="vts_pl_tiles"
                source-layer="public.parking_segments"
                filter={['in', 'id', '']}
                paint={{
                  'line-width': 6,
                  'line-color': 'rgba(146, 49, 154, 1)',
                }}
              />
              <Layer
                id="vts_pl_no"
                type="line"
                source="vts_pl_tiles"
                source-layer="public.parking_segments"
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
                id="vts_pl_label"
                type="symbol"
                source="vts_pl_tiles"
                source-layer="public.parking_segments"
                layout={{
                  'text-field': '{capacity}',
                  'symbol-placement': 'line-center',
                }}
                paint={{
                  'text-halo-color': 'rgba(255, 255, 255, 1)',
                  'text-halo-width': 1,
                }}
              />
              <Layer
                id="vts_pl_all_other"
                type="line"
                source="vts_pl_tiles"
                source-layer="public.parking_segments"
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
            </Source>
            <Source
              id="vts_boundaries_tiles"
              type="vector"
              tiles={[
                'https://vts.mapwebbing.eu/public.boundaries/{z}/{x}/{y}.pbf',
              ]}
              minzoom={8}
              maxzoom={22}
            >
              <Layer
                id="vts_boundaries"
                type="line"
                source="vts_boundaries_tiles"
                source-layer="public.boundaries"
                filter={['all', ['>=', 'admin_level', "'10'"]]}
                paint={{
                  'line-width': 2,
                  'line-color': 'rgba(215, 34, 34, 1)',
                }}
              />
            </Source>
          </Map>
          <BackgroundPicker />
        </MapProvider>
      </div>
    </Layout>
  )
}

export default IndexPage
