import { useRef } from 'react'
import { FilterSpecification } from 'maplibre-gl'
import { Layer, LayerProps, Source } from 'react-map-gl/maplibre'
import { useMapDebugUseDebugLayerStyles } from 'src/app/regionen/[regionSlug]/_hooks/mapState/useMapDebugState'
import { useDataParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useDataParam'
import { useRegionDatasets } from '../../../_hooks/useRegionDatasets/useRegionDatasets'
import { debugLayerStyles } from '../../../_mapData/mapDataSubcategories/mapboxStyles/debugLayerStyles'
import {
  createDatasetSourceLayerKey,
  createSourceKeyStaticDatasets,
} from '../../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { layerVisibility } from '../utils/layerVisibility'
import { createPmtilesUrl } from './utils/createPmtilesUrl'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'
import { getLayerHighlightId } from '../utils/layerHighlight'
import { LayerHighlight } from './LayerHighlight'

export const SourcesLayersStaticDatasets = () => {
  const datasetsPreviouslyVisible = useRef({})
  const { dataParam: selectedDatasetIds } = useDataParam()
  const useDebugLayerStyles = useMapDebugUseDebugLayerStyles()
  const regionDatasets = useRegionDatasets()

  if (!regionDatasets || !selectedDatasetIds) return null

  return (
    <>
      {regionDatasets.map(({ id: sourceId, subId, type, url, attributionHtml, layers }) => {
        const datasetSourceId = createSourceKeyStaticDatasets(sourceId, subId)
        const visible = selectedDatasetIds.includes(datasetSourceId)
        const visibility = layerVisibility(visible)

        // don't render Source (and load data) before it was not visible at least once
        const datasetWasVisible = !!datasetsPreviouslyVisible.current[datasetSourceId]
        if (!datasetWasVisible && !visible) return null
        datasetsPreviouslyVisible.current[datasetSourceId] = true

        const sourceProps =
          type === 'GEOJSON'
            ? { type: 'geojson' as const, data: url }
            : { type: 'vector' as const, url: createPmtilesUrl(url) }

        return (
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
              const layerFilter = (
                useDebugLayerStyles ? ['all'] : wrapFilterWithAll(layer.filter)
              ) as FilterSpecification

              // Use ?debugMap=true and <DebugMap> to setUseDebugLayerStyles
              const layerPaint = useDebugLayerStyles
                ? debugLayerStyles({
                    source: sourceId,
                    sourceLayer: 'default',
                  }).find((l) => l.type === layer.type)?.paint
                : layer.paint

              const layerProps: LayerProps = {
                id: layerId,
                source: datasetSourceId,
                type: layer.type,
                layout,
                // There is something very weird with TS here. We cannot use @ts-expect-errors because the build will fail. But without the `any` we get an error in `npm run type-check`.
                filter: layerFilter as any,
                paint: layerPaint as any,
                beforeId:
                  'beforeId' in layer
                    ? (layer.beforeId as string) || 'atlas-app-beforeid-fallback'
                    : 'atlas-app-beforeid-fallback',
              }

              if (type === 'PMTILES') {
                layerProps['source-layer'] = 'default'
              }

              const layerHighlightId = getLayerHighlightId(layerId)

              return (
                <>
                  <Layer key={layerId} {...(layerProps as LayerProps)} />
                  <LayerHighlight
                    key={layerHighlightId}
                    {...{ ...layerProps, id: layerHighlightId }}
                  />
                </>
              )
            })}
          </Source>
        )
      })}
    </>
  )
}
