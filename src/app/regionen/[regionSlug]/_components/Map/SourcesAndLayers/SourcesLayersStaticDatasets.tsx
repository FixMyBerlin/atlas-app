import { Layer, LayerProps, Source } from 'react-map-gl/maplibre'
import { useMapDebugState } from 'src/app/regionen/[regionSlug]/_hooks/mapStateInteraction/useMapDebugState'
import { useDataParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useDataParam'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { useRegionDatasets } from '../../../_hooks/useRegionDatasets/useRegionDatasets'
import { debugLayerStyles } from '../../../_mapData/mapDataSubcategories/mapboxStyles/debugLayerStyles'
import {
  createDatasetSourceLayerKey,
  createSourceKeyStaticDatasets,
} from '../../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { layerVisibility } from '../utils/layerVisibility'
import { extractHighlightFeatureIds } from './utils/extractHighlightFeatureIds'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'
import { pmtilesUrl } from './utils/pmtilesUrl'

export const SourcesLayersStaticDatasets = () => {
  const { dataParam: selectedDatasetIds } = useDataParam()
  const { useDebugLayerStyles } = useMapDebugState()

  const regionDatasets = useRegionDatasets()
  const { inspectorFeatures } = useMapStateInteraction()

  if (!regionDatasets || !selectedDatasetIds) return null

  return (
    <>
      {regionDatasets.map(
        ({ id: sourceId, subId, type, url, attributionHtml, layers, inspector }) => {
          const datasetSourceId = createSourceKeyStaticDatasets(sourceId, subId)
          const visible = selectedDatasetIds.includes(datasetSourceId)
          const visibility = layerVisibility(visible)

          const highlightingKey =
            'highlightingKey' in inspector && inspector?.highlightingKey !== 'TODO'
              ? inspector?.highlightingKey
              : undefined
          const featureIds = highlightingKey
            ? extractHighlightFeatureIds(inspectorFeatures, highlightingKey)
            : []

          return (
            <Source
              id={datasetSourceId}
              key={datasetSourceId}
              type={type}
              url={pmtilesUrl(url)}
              attribution={attributionHtml}
              promoteId={highlightingKey}
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
                  source: datasetSourceId,
                  'source-layer': 'default', // set in `datasets/process.ts`
                  type: layer.type,
                  layout: layout,
                  filter: layerFilter,
                  paint: layerPaint,
                  beforeId:
                    'beforeId' in layer
                      ? layer.beforeId || 'atlas-app-beforeid-fallback'
                      : 'atlas-app-beforeid-fallback',
                }

                return <Layer key={layerId} {...(layerProps as LayerProps)} />
              })}
            </Source>
          )
        },
      )}
    </>
  )
}
