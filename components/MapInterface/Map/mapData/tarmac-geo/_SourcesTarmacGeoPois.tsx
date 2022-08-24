import { useQuery } from '@/components/MapInterface/store'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { layerVisibility } from '../../utils'
import { LayerFromStyle } from './components'
import { tarmacStyle } from './utils'

export const SourcesTarmacGeoPois: React.FC = () => {
  const {
    values: { selectedTopicIds },
  } = useQuery()

  const topics = []
  // const topics = Object.entries(sourcesTarmacGeoPois).map(
  //   ([_key, values]) => values.vectorTileLayerGroup
  // )

  // Order: Last defined <Layer> are on top
  return (
    <Source
      id="tarmac-geo-pois"
      type="vector"
      tiles={[
        `https://api.mapbox.com/v4/hejco.3hccfujx/{z}/{x}/{y}.vector.pbf?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
        // 'https://tiles.osm-berlin.org/tarmac-geo/zes-bb-tt-poi/{z}/{x}/{y}.pbf',
      ]}
      minzoom={8}
      maxzoom={22}
    >
      {/* {
          "id": "fmc-poibarriers_train",
          "type": "line",
          "metadata": {
            "mapbox:group": "e4184f339655228ca89d272e79bedcb6",
            "groupName": "fmc-barriers"
          },
          "source": "composite",
          "source-layer": "poiBarriers",
          "filter": [
            "all",
            ["match", ["geometry-type"], ["LineString"], true, false],
            ["match", ["get", "railway"], ["rail"], true, false]
          ],
          "paint": {
            "line-color": "hsl(300, 88%, 10%)",
            "line-width": ["interpolate", ["linear"], ["zoom"], 10, 2, 18, 4]
          }
      }, */}
      {/* <Layer
        key="fmc-poibarriers_train"
        id="fmc-poibarriers_train"
        type="line"
        source="tarmac-geo-pois"
        source-layer="poiBarriers"
        filter={[
          'all',
          ['match', ['geometry-type'], ['LineString'], true, false],
          ['match', ['get', 'railway'], ['rail'], true, false],
        ]}
        paint={{
          'line-color': 'hsl(300, 88%, 10%)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 18, 4],
        }}
      /> */}
      {topics.map((topic) => (
        <LayerFromStyle
          key={`tarmac-geo-pois-${topic}`}
          style={tarmacStyle}
          source="tarmac-geo-pois"
          group={`fmc-${topic}`}
          visible={!!selectedTopicIds && selectedTopicIds.includes(topic)}
        />
      ))}
    </Source>
  )
}
