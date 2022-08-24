import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { useQuery } from '../../store/geschichte'
import { layerVisibility } from '../utils'
import { beforeId } from './beforeId.const'
import { sourcesRaster } from './sourcesRaster.const'
import { layerIdFromSourceId } from './utils'

export const SourcesLayerRasterBackgrounds: React.FC = () => {
  const {
    values: { selectedBackgroundId },
  } = useQuery()

  return (
    <>
      {Object.entries(sourcesRaster).map(
        ([backgroundId, { tiles, minzoom, maxzoom, attribution }]) => {
          // TODO – commented out the two layers that needed those props; had issues with the default props … or something
          // const optSchemeProp = scheme ? { scheme } : {}
          // const optTileSizeProp = tileSize ? { tileSize } : {}

          const visible = selectedBackgroundId === backgroundId
          return (
            <Source
              id={backgroundId}
              key={backgroundId}
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
                id={layerIdFromSourceId(backgroundId)}
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
