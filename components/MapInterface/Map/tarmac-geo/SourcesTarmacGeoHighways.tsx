import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { Source } from 'react-map-gl'
import { useQuery } from '../../store/geschichte'
import { layerVisibility } from '../utils'
import { LayerFromStyle } from './components'
import { tarmacStyle } from './utils'

export const SourcesTarmacGeoHighways: React.FC = () => {
  const {
    values: { selectedSources },
  } = useQuery()

  const topics = [
    'maxspeed',
    'oberflaechenqualitaet',
    'radinfra',
    'strassentypen',
    'surface-bad',
  ] as const

  // Order: Last defined <Layer> are on top
  return (
    <Source
      id="tarmac-geo-highways"
      type="vector"
      tiles={[
        `https://api.mapbox.com/v4/hejco.d7mywzd3/{z}/{x}/{y}.vector.pbf?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
        // 'https://tiles.osm-berlin.org/tarmac-geo/zes-bb-tt-allhighways/{z}/{x}/{y}.pbf',
      ]}
      minzoom={8}
      maxzoom={22}
    >
      {topics.map((topic) => (
        <LayerFromStyle
          key={`tarmac-geo-highways-${topic}`}
          style={tarmacStyle}
          source="tarmac-geo-pois"
          group={`fmc-${topic}`}
          visibility={layerVisibility(
            !!selectedSources && selectedSources.includes(topic)
          )}
        />
      ))}
    </Source>
  )
}
