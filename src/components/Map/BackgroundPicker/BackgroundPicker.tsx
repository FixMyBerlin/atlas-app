import React from 'react'
import { Layer, Source, useControl, useMap } from 'react-map-gl'
// import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { backgroundLayer } from './backgroundLayer.const'

export const BackgroundPicker: React.FC = () => {
  if (useMap().current === undefined) return null
  const { mainMap } = useMap()

  const usableBackgroundIds = Object.keys(backgroundLayer)
  //   .filter(
  //   (sourceId) => {
  //     const layerId = sourceId.replace('_tiles', '')
  //     console.log({ sourceId, layerId, map, true: map.getLayer(layerId) })
  //     return map.getLayer(layerId)
  //   }
  // )

  // TODO: Liefert Zeichen-Tools für die Karte
  //   https://github.com/mapbox/mapbox-gl-draw
  // useControl(() => new MapboxDraw(), {
  //   position: 'bottom-left',
  // })

  return (
    <div>
      <h2 className="text-base font-medium text-gray-900">Hintergrund</h2>
      <p className="text-sm leading-5 text-gray-500">
        Hintergrundkarte wechseln
      </p>
      <fieldset className="mt-4">
        <legend className="sr-only">Hintergrundkarten</legend>
        <div className="space-y-4">
          {usableBackgroundIds.map((key) => {
            const { displayName } = backgroundLayer[key]
            return (
              <div key={key} className="flex items-center">
                <input
                  id={key}
                  name="notification-method"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={key}
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {displayName}
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>
      {Object.entries(backgroundLayer).map(
        ([layerName, { tiles, minzoom, maxzoom, attribution }]) => {
          // todo: commented out the two layers that needed those props; had issues with the default props … or something
          // const optSchemeProp = scheme ? { scheme } : {}
          // const optTileSizeProp = tileSize ? { tileSize } : {}
          return (
            <Source
              id={layerName}
              key={layerName}
              type="raster"
              tiles={tiles}
              minzoom={minzoom}
              maxzoom={maxzoom}
              attribution={attribution}
              // Only for some
              // {...optSchemeProp}
              // {...optTileSizeProp}
            >
              <Layer
                id={layerName.replace('_tiles', '')}
                type="raster"
                source={layerName}
                layout={{ visibility: 'none' }}
                // beforeId="vts_pl" // does not work, layers are not recognizsed by string … or something
              />
            </Source>
          )
        }
      )}
    </div>
  )
}
