import { sourcesDatasets } from '@components/MapInterface/mapData/sourcesMapData/sourcesDatasets.const'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { layerVisibility } from '../utils'
import { createDatasetSourceLayerKey } from '@components/MapInterface/utils'

export const SourcesLayerDatasets: React.FC = () => {
  const { data: selectedDatasetIds } = useSearch<LocationGenerics>()
  const { pmTilesProtocolReady } = useMapStateInteraction()

  if (!selectedDatasetIds || !pmTilesProtocolReady) return null

  return (
    <>
      {sourcesDatasets.map(({ id: sourceId, type, url, attributionHtml, layers }) => {
        const datasetTileId = `${sourceId}_tiles__pmTiles_ready_${pmTilesProtocolReady}`
        const visible = selectedDatasetIds.includes(sourceId)
        const visibility = layerVisibility(visible)

        return (
          <Source
            id={datasetTileId}
            key={datasetTileId}
            type={type}
            url={url}
            attribution={attributionHtml}
          >
            {layers.map((layer) => {
              const layout =
                layer.layout === undefined ? visibility : { ...visibility, ...layer.layout }

              const layerId = createDatasetSourceLayerKey(sourceId, layer.id)

              return (
                <Layer
                  key={layerId}
                  id={layerId}
                  source={datasetTileId}
                  source-layer="default" // set in `datasets/process.cjs`
                  type={layer.type}
                  layout={layout}
                  paint={
                    layer.paint as any /* Did not get TS going. `paint` is explicitly required but something else is interfering here */
                  }
                  beforeId={undefined} // on top of everything
                />
              )
            })}
          </Source>
        )
      })}
    </>
  )
}
