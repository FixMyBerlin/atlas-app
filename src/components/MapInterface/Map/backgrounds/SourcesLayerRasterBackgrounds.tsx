import React from 'react'
import { Layer, Source, useMap } from 'react-map-gl'
import { useQuery } from '../../store/geschichte'
import { replaceZxy } from '../../utils/replaceZxy'
import { sourcesBackgroundsRaster } from '../mapData/sourcesMapDataConfig'
import { layerVisibility } from '../utils'
import { beforeId } from './beforeId.const'

export const SourcesLayerRasterBackgrounds: React.FC = () => {
  const {
    values: {
      selectedBackgroundId,
      map: { zoom, lat, lng },
    },
  } = useQuery()

  return (
    <>
      {sourcesBackgroundsRaster.map(
        ({ id, tiles, minzoom, maxzoom, attributionHtml }) => {
          // TODO – commented out the two layers that needed those props; had issues with the default props … or something
          // const optSchemeProp = scheme ? { scheme } : {}
          // const optTileSizeProp = tileSize ? { tileSize } : {}
          const backgroundId = `${id}_tiles`

          const visible = selectedBackgroundId === id

          const enhancedAttributionHtml = replaceZxy({
            url: attributionHtml,
            zoom,
            lat,
            lng,
          })
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
