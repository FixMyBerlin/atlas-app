import { Layer, LayerProps, Source } from 'react-map-gl/maplibre'
import { LayerSpecification } from 'maplibre-gl'
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
import { createPmtilesUrl } from './utils/createPmtilesUrl'

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

        const sourceProps =
          type === 'GEOJSON'
            ? { type: 'geojson', data: url }
            : { type: 'vector', url: createPmtilesUrl(url) }

        return (
          // @ts-ignore - see comment at {...sourceProps}
          <Source
            id={datasetSourceId}
            key={datasetSourceId}
            attribution={attributionHtml}
            {...sourceProps} // type inference fails here - maybe a typescript bug?
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

              let layerProps: LayerSpecification = {
                id: layerId,
                source: datasetSourceId,
                type: layer.type,
                layout: layout,
                // @ts-ignore
                filter: layerFilter,
                paint: layerPaint,
                beforeId:
                  'beforeId' in layer
                    ? layer.beforeId || 'atlas-app-beforeid-fallback'
                    : 'atlas-app-beforeid-fallback',
              }

              if (type === 'PMTILES') {
                layerProps['source-layer'] = 'default'
              }

              // To get LayerHighlight working some more refactoring is needed to harmonize sourceData and datasetsData
              // <LayerHighlight {...layerProps} />
              return <Layer key={layerId} {...(layerProps as LayerProps)} />
            })}
          </Source>
        )
      })}
    </>
  )
}
