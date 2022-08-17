import React, { useCallback, useEffect, useState } from 'react'
import { Map, MapProvider, useMap } from 'react-map-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl from 'maplibre-gl'

const MyMap = () => {
  return (
    <Map
      id="mymap"
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: 800, height: 600 }}
      mapStyle="https://api.maptiler.com/maps/basic/style.json?key=ECOoUBmpqklzSCASXxcu"
      mapLib={maplibregl}
    />
  )
}

const Controls = () => {
  const { mymap } = useMap()
  const [inputValue, setInputValue] = useState('')
  const [hasError, setError] = useState(false)

  useEffect(() => {
    if (!mymap) return undefined

    const onMove = () => {
      const { lng, lat } = mymap.getCenter()
      setInputValue(`${lng.toFixed(3)}, ${lat.toFixed(3)}`)
      setError(false)
    }
    mymap.on('move', onMove)
    onMove()

    return () => {
      mymap.off('move', onMove)
    }
  }, [mymap])

  const onChange = useCallback((evt) => {
    setInputValue(evt.target.value)
  }, [])

  const onSubmit = useCallback(() => {
    const [lng, lat] = inputValue.split(',').map(Number)
    if (Math.abs(lng) <= 180 && Math.abs(lat) <= 85) {
      mymap.easeTo({
        center: [lng, lat],
        duration: 1000,
      })
    } else {
      setError(true)
    }
  }, [mymap, inputValue])

  return (
    <div style={{ padding: 12, fontFamily: 'sans-serif' }}>
      <span>MAP CENTER: </span>
      <input
        type="text"
        value={inputValue}
        onChange={onChange}
        style={{ color: hasError ? 'red' : 'black' }}
      />
      <button type="button" onClick={onSubmit}>
        GO
      </button>
    </div>
  )
}

const Root = () => {
  return (
    <MapProvider>
      <Controls />
      <MyMap />
    </MapProvider>
  )
}
export default Root
