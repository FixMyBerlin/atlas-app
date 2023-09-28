import { useRegionSlug } from '@components/regionUtils/useRegionSlug'
import React from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { sourcesDatasets } from 'src/core/components/MapInterface/mapData'
import { debugLayerStyles } from 'src/core/components/MapInterface/mapData/topicsMapData/mapboxStyles/debugLayerStyles'
import { useMapStateInteraction } from 'src/core/components/MapInterface/mapStateInteraction'
import { useMapDebugState } from 'src/core/components/MapInterface/mapStateInteraction/useMapDebugState'
import { createDatasetSourceLayerKey } from 'src/core/components/MapInterface/utils'
import { useDataParam } from 'src/core/useQueryState/useDataParam'
import { layerVisibility } from '../utils'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'

export const SourcesLayerDatasets: React.FC = () => {
  const { dataParam: selectedDatasetIds } = useDataParam()
  const { pmTilesProtocolReady } = useMapStateInteraction()
  const { useDebugLayerStyles } = useMapDebugState()
  const regionSlug = useRegionSlug()

  const uniqueRegionDatasets = sourcesDatasets
    .filter((data) => (data.regionKey as string[]).includes(regionSlug))
    // Make the array unique by data.url
    .filter((dataset, index, self) => index === self.findIndex((d) => d.url === dataset.url))

  if (!uniqueRegionDatasets || !selectedDatasetIds || !pmTilesProtocolReady) return null

  return (
    <>
      {uniqueRegionDatasets.map(({ id: sourceId, type, url, attributionHtml, layers }) => {
        const datasetTileId = `source:${sourceId}`
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
              // Use ?debugMap=true and <DebugMap> to setUseDebugLayerStyles
              const layerFilter = useDebugLayerStyles ? ['all'] : wrapFilterWithAll(layer.filter)

              // Use ?debugMap=true and <DebugMap> to setUseDebugLayerStyles
              const layerPaint = useDebugLayerStyles
                ? debugLayerStyles({
                    source: sourceId,
                    sourceLayer: 'default',
                  }).find((l) => l.type === layer.type)?.paint
                : (layer.paint as any)

              const layerProps = {
                id: layerId,
                source: datasetTileId,
                'source-layer': 'default', // set in `datasets/process.cjs`
                type: layer.type,
                layout: layout,
                filter: layerFilter,
                paint: layerPaint,
                beforeId: undefined, // on top of everything
              }

              // To get LayerHighlight working some more refactoring is needed to harmoize sourceData and datasetsData
              // <LayerHighlight {...layerProps} />
              return <Layer key={layerId} {...layerProps} />
            })}
          </Source>
        )
      })}
    </>
  )
}
