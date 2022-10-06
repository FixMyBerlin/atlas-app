import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { replaceZxy } from '../../utils/replaceZxy'
import { sourcesBackgroundsRaster } from '../../mapData/sourcesMapDataConfig'
import { layerVisibility } from '../utils'
import { beforeId } from './beforeId.const'

export const SourcesLayerRasterBackgrounds: React.FC = () => {
  const {
    lat,
    lng,
    zoom,
    bg: selectedBackgroundId,
  } = useSearch<LocationGenerics>()

  return (
    <>
      {sourcesBackgroundsRaster.map(
        ({ id, tiles, minzoom, maxzoom, attributionHtml }) => {
          // TODO – commented out the two layers that needed those props; had issues with the default props … or something
          // const optSchemeProp = scheme ? { scheme } : {}
          // const optTileSizeProp = tileSize ? { tileSize } : {}
          const backgroundId = `${id}_tiles`

          const visible = selectedBackgroundId === id

          const enhancedAttributionHtml = attributionHtml
          // TODO: The idea was to be able to use {x}… params in the attribution string
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
              // Only for some
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
        }
      )}
    </>
  )
}
