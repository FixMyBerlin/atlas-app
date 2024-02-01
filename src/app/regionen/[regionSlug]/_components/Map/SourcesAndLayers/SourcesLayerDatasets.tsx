import React from 'react'
import { Layer, LayerProps, Source } from 'react-map-gl/maplibre'
import { useMapDebugState } from 'src/app/regionen/[regionSlug]/_hooks/mapStateInteraction/useMapDebugState'
import { useDataParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useDataParam'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { debugLayerStyles } from '../../../_mapData/mapDataSubcategories/mapboxStyles/debugLayerStyles'
import {
  createDatasetKey,
  createDatasetSourceLayerKey,
} from '../../utils/createKeyUtils/createKeyUtils'
import { layerVisibility } from '../utils/layerVisibility'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'
import { useRegionDatasets } from '../../SelectDatasets/utils/useRegionDatasets'

export const SourcesLayerDatasets: React.FC = () => {
  const { dataParam: selectedDatasetIds } = useDataParam()
  const { pmTilesProtocolReady } = useMapStateInteraction()
  const { useDebugLayerStyles } = useMapDebugState()

  const regionDatasets = useRegionDatasets()

  if (!regionDatasets || !selectedDatasetIds || !pmTilesProtocolReady) return null

  return (
    <>
      {regionDatasets.map(({ id: sourceId, subId, type, url, attributionHtml, layers }) => {
        const datasetTileId = createDatasetKey(sourceId, subId)
        const visible = selectedDatasetIds.includes(datasetTileId)
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

              const layerId = createDatasetSourceLayerKey(sourceId, subId, layer.id)
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
                'source-layer': 'default', // set in `datasets/process.ts`
                type: layer.type,
                layout: layout,
                filter: layerFilter,
                paint: layerPaint,
                beforeId: undefined, // on top of everything
              }

              // To get LayerHighlight working some more refactoring is needed to harmoize sourceData and datasetsData
              // <LayerHighlight {...layerProps} />
              return <Layer key={layerId} {...(layerProps as LayerProps)} />
            })}
          </Source>
        )
      })}
    </>
  )
}
