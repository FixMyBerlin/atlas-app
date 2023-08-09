import React, { useCallback, useEffect, useState } from 'react'
import { FeatureCollection } from 'geojson'
import axios from 'axios'
import { Layer, Source, SymbolLayer, useMap } from 'react-map-gl'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'

export const DynamicSources: React.FC = () => {
  const { mainMap } = useMap()
  // const [activeRequestEventHandler, setActiveRequestEventHandler] = useState(false)
  const { mapLoaded, setOsmNotesLoaded, osmNotesActive } = useMapStateInteraction()

  const [geodata, setGeodata] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })

  // Cache function, otherwise deactivating the event handler will not work
  const osmNotesApiRequest = useCallback(() => {
    if (!mainMap) return
    setOsmNotesLoaded(false)
    const b = mainMap.getBounds()
    axios
      .get(
        `https://api.openstreetmap.org/api/0.6/notes?bbox=${b.getSouthWest().lng},${
          b.getSouthWest().lat
        },${b.getNorthEast().lng},${b.getNorthEast().lat}`
      )
      .then((res) => {
        setGeodata(res.data)
        setOsmNotesLoaded(true)
      })
  }, [])

  // Handle event handler -> only when osm notes layer is active
  useEffect(() => {
    if (!mainMap || !mapLoaded) return

    console.warn('osmnotes active, fetching data', osmNotesActive)

    if (osmNotesActive) {
      mainMap.on('moveend', osmNotesApiRequest)
    }

    if (!osmNotesActive) {
      mainMap.off('moveend', osmNotesApiRequest)
    }
  }, [osmNotesActive])

  // On first activation, fetch data without map interaction
  useEffect(() => {
    osmNotesApiRequest()
  }, [])

  const layerProps: SymbolLayer = {
    id: 'osmnoteslayer',
    source: 'osm-notes',
    // 'source-layer': 'default', // set in `datasets/process.cjs`
    type: 'symbol',
    layout: {
      visibility: 'visible',
      'icon-image': [
        'match',
        ['get', 'status'],
        'closed',
        'check_icon',
        'open',
        'closed_icon',
        'closed_icon' /* default */,
      ],
      'icon-size': 0.5,
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
      {osmNotesActive && <Layer key="osmnoteslayer" {...layerProps} />}
      {/* To get LayerHighlight working some more refactoring is needed to harmoize sourceData and datasetsData */}
      {/* <LayerHighlight {...layerProps} /> */}
    </Source>
  )
}
