import { sourcesDatasets } from '@components/MapInterface/mapData/sourcesMapData/sourcesDatasets.const'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { layerVisibility } from '../utils'

export const SourcesLayerDatasets: React.FC = () => {
  const { data: selectedDatasetIds } = useSearch<LocationGenerics>()

  if (!selectedDatasetIds) return null

  return (
    <>
      {sourcesDatasets.map(({ id, type, data, attributionHtml, layers }) => {
        const datasetTileId = `${id}_tiles`
        const visible = selectedDatasetIds.includes(id)

        return (
          <Source
            id={datasetTileId}
            key={datasetTileId}
            type={type}
            data={data}
            attribution={attributionHtml}
          >
            {layers.map((layer) => {
              return (
                <Layer
                  key={layer.id}
                  id={layer.id}
                  source={datasetTileId}
                  type={layer.type}
                  layout={layerVisibility(visible)}
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
