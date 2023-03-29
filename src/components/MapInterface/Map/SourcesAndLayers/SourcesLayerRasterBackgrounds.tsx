import { LocationGenerics } from '@routes/routes'
import { regionFromPath } from '@routes/utils'
import { useMatch, useSearch } from '@tanstack/react-location'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { sourcesBackgroundsRaster } from '../../mapData/sourcesMapData'
import { layerVisibility } from '../utils'

export const SourcesLayerRasterBackgrounds: React.FC = () => {
  const {
    // See TODO A, below.
    // lat,
    // lng,
    // zoom,
    bg: selectedBackgroundId,
  } = useSearch<LocationGenerics>()
  const {
    params: { regionPath },
  } = useMatch()
  const region = regionFromPath(regionPath)

  if (!region?.backgroundSources) return null

  const backgrounds = sourcesBackgroundsRaster.filter((s) =>
    region.backgroundSources.includes(s.id)
  )

  // Last layer in Array `allLayer.filter((l) => l.source === 'openmaptiles')`
  // Picking a different layer would who maptiler Vector data on top of the background
  // Check the list via <Map> => `handleLoad` => `console.log`
  // See also <SourceAndLayers> => `layerOrder`
  const beforeId = 'housenumber'

  return (
    <>
      {backgrounds.map(({ id, tiles, minzoom, maxzoom, attributionHtml }) => {
        // TODO B: commented out the two layers that needed those props; had issues with the default props … or something
        // const optSchemeProp = scheme ? { scheme } : {}
        // const optTileSizeProp = tileSize ? { tileSize } : {}
        const backgroundId = `${id}_tiles`

        const visible = selectedBackgroundId === id

        const enhancedAttributionHtml = attributionHtml
        // TODO A: The idea was to be able to use {x}… params in the attribution string
        //    however, that causes React devtool warnings `Unable to update <Source> prop: attribution`.
        //    So for now, this is disabled…
        // const enhancedAttributionHtml = replaceZxy({
        //   url: attributionHtml,
        //   zoom,
        //   lat,
        //   lng,
        // })
        return (
          <Source
            id={backgroundId}
            key={backgroundId}
            type="raster"
            tiles={[tiles]}
            minzoom={minzoom}
            maxzoom={maxzoom}
            attribution={enhancedAttributionHtml}
            // SEE TODO B: Only for some
            // {...optSchemeProp}
            // {...optTileSizeProp}
          >
            <Layer
              id={id}
              type="raster"
              source={backgroundId}
              layout={layerVisibility(visible)}
              beforeId={beforeId}
            />
          </Source>
        )
      })}
    </>
  )
}
