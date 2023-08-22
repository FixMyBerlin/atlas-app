import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import { LocationGenerics } from '@routes/index'
import { useSearch } from '@tanstack/react-location'
import axios from 'axios'
import { FeatureCollection } from 'geojson'
import React, { useEffect, useState } from 'react'
import { Layer, Source, useMap } from 'react-map-gl'

export const osmNotesLayerId = 'osm-notes'

export const SourcesLayersOsmNotes: React.FC = () => {
  const { mainMap } = useMap()
  const { inspectorFeatures, mapLoaded, setOsmNotesLoading } = useMapStateInteraction()
  const { osmNotes, lat, lng } = useSearch<LocationGenerics>()

  const osmNotesFeatureIds = inspectorFeatures
    .filter((feature) => feature.source === 'osm-notes')
    .map((feature) => (feature?.properties?.id || 0) as number)

  const [geodata, setGeodata] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })

  // Cache function, otherwise deactivating the event handler will not work
  const osmNotesApiRequest = () => {
    if (!mainMap) return
    setOsmNotesLoading(true)
    const mapBounds = mainMap.getBounds().toArray()
    axios
      .get(`https://api.openstreetmap.org/api/0.6/notes?bbox=${mapBounds.join(',')}`)
      .then((res) => {
        setGeodata(res.data)
        setOsmNotesLoading(false)
      })
  }

  // (Re)fetch whenever the view port changes
  useEffect(() => {
    mapLoaded && osmNotes && osmNotesApiRequest()
  }, [mapLoaded, osmNotes, lat, lng])

  return (
    <Source
      id="osm-notes"
      key="osm-notes"
      type="geojson"
      data={geodata}
      attribution="Notes: openstreetmap.org"
    >
      {osmNotes && (
        <>
          <Layer
            id="osm-notes-hover"
            key="osm-notes-hover"
            source="osm-notes"
            type="circle"
            paint={{
              'circle-radius': 14,
              'circle-color': '#115e59', // teal-800 https://tailwindcss.com/docs/customizing-colors
              'circle-opacity': 0.6,
              'circle-blur': 0.3,
            }}
            filter={['in', 'id', ...osmNotesFeatureIds]}
          />
          <Layer
            id={osmNotesLayerId}
            key="osm-notes"
            source="osm-notes"
            type="symbol"
            layout={{
              visibility: 'visible',
              'icon-image': [
                'match',
                ['get', 'status'],
                'closed' /* status=closed */,
                'check_icon',
                'open' /* status=open */,
                'closed_icon',
                'closed_icon' /* default */,
              ],
              'icon-allow-overlap': true,
            }}
          />
        </>
      )}
    </Source>
  )
}
