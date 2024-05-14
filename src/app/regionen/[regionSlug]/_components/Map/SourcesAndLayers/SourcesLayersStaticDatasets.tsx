import { Layer, LayerProps, Source } from 'react-map-gl/maplibre'
import { useMapDebugState } from 'src/app/regionen/[regionSlug]/_hooks/mapStateInteraction/useMapDebugState'
import { useDataParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useDataParam'
import { useRegionDatasets } from '../../../_hooks/useRegionDatasets/useRegionDatasets'
import { debugLayerStyles } from '../../../_mapData/mapDataSubcategories/mapboxStyles/debugLayerStyles'
import {
  createSourceKeyStaticDatasets,
  createDatasetSourceLayerKey,
} from '../../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { layerVisibility } from '../utils/layerVisibility'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'
import { pmtilesUrl } from './utils/pmtilesUrl'

export const SourcesLayersStaticDatasets: React.FC = () => {
  const { dataParam: selectedDatasetIds } = useDataParam()
  const { useDebugLayerStyles } = useMapDebugState()

  const regionDatasets = useRegionDatasets()

  if (!regionDatasets || !selectedDatasetIds) return null

  return (
    <>
      {regionDatasets.map(({ id: sourceId, subId, type, url, attributionHtml, layers }) => {
        const datasetSourceId = createSourceKeyStaticDatasets(sourceId, subId)
        const visible = selectedDatasetIds.includes(datasetSourceId)
        const visibility = layerVisibility(visible)

        return (
          <Source
            id={datasetSourceId}
            key={datasetSourceId}
            type={type}
            url={pmtilesUrl(url)}
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
