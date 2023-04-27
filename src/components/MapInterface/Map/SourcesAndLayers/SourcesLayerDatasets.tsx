import { sourcesDatasets } from '@components/MapInterface/mapData/sourcesMapData/sourcesDatasets.const'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { layerVisibility } from '../utils'

export const SourcesLayerDatasets: React.FC = () => {
  const { data: selectedDatasetIds } = useSearch<LocationGenerics>()
  const { pmTilesProtocolReady } = useMapStateInteraction()

  if (!selectedDatasetIds || !pmTilesProtocolReady) return null

  return (
    <>
      {sourcesDatasets.map(({ id, type, url, attributionHtml, layers }) => {
        const datasetTileId = `${id}_tiles__pmTiles_ready_${pmTilesProtocolReady}`
        const visible = selectedDatasetIds.includes(id)
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

              return (
                <Layer
                  key={layer.id}
                  id={layer.id}
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
