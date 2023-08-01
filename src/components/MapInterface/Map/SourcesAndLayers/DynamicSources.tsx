import React, { useEffect, useState } from 'react'
import { FeatureCollection } from 'geojson'
import axios from 'axios'
import { CircleLayer, Layer, Source, useMap } from 'react-map-gl'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'

export const DynamicSources: React.FC = () => {
  const { mainMap } = useMap()
  const { mapLoaded } = useMapStateInteraction()

  const [geodata, setGeodata] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })

  useEffect(() => {
    if (!mainMap || !mapLoaded) return

    mainMap.on('moveend', () => {
      const bounds = mainMap.getBounds()
      axios
        .get(
          `https://api.openstreetmap.org/api/0.6/notes?bbox=${bounds._sw.lng},${bounds._sw.lat},${bounds._ne.lng},${bounds._ne.lat}`
        )
        .then((res) => {
          console.log(res.data)
          setGeodata(res.data)
        })
    })
  }, [mapLoaded])

  const layerProps: CircleLayer = {
    id: 'osmnoteslayer',
    source: 'osm-notes',
    // 'source-layer': 'default', // set in `datasets/process.cjs`
    type: 'circle',
    layout: {
      visibility: 'visible',
    },
    paint: {
      'circle-radius': 5,
      'circle-color': 'red',
      'circle-stroke-width': 1,
    },
  }

  return (
    <Source
      id="osm-notes"
      key="osm-notes"
      type="geojson"
      data={geodata}
      attribution="Source osm.org"
    >
      <Layer key="osmnoteslayer" {...layerProps} />
      {/* To get LayerHighlight working some more refactoring is needed to harmoize sourceData and datasetsData */}
      {/* <LayerHighlight {...layerProps} /> */}
    </Source>
  )
}
