import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { useStoreMap } from '../../store'
import { useQuery } from '../../store/geschichte'
import { layerIdToPlaceBackgroundsBefore } from '../parkingLanes'
import { sourcesRaster } from './sourcesRaster.const'
import { layerIdFromSourceId } from './utils'

export const SourcesLayerRasterBackgrounds: React.FC = () => {
  const {
    values: { currentBackground },
  } = useQuery()

  return (
    <>
      {Object.entries(sourcesRaster).map(
        ([layerName, { tiles, minzoom, maxzoom, attribution }]) => {
          // TODO – commented out the two layers that needed those props; had issues with the default props … or something
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
                id={layerIdFromSourceId(layerName)}
                type="raster"
                source={layerName}
                layout={{
                  visibility:
                    currentBackground === layerName ? 'visible' : 'none',
                }}
                beforeId={layerIdToPlaceBackgroundsBefore}
              />
            </Source>
          )
        }
      )}
    </>
  )
}
