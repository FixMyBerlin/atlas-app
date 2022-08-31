import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { useQuery } from '../../store/geschichte'
import { sourcesBackgroundsRaster } from '../mapData/sourcesMapDataConfig'
import { layerVisibility } from '../utils'
import { beforeId } from './beforeId.const'

export const SourcesLayerRasterBackgrounds: React.FC = () => {
  const {
    values: { selectedBackgroundId },
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
          return (
            <Source
              id={backgroundId}
              key={backgroundId}
              type="raster"
              tiles={[tiles]}
              minzoom={minzoom}
              maxzoom={maxzoom}
              attribution={attributionHtml}
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
