import { FilterSpecification } from 'maplibre-gl'
import React from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { useMapDebugState } from 'src/app/regionen/[regionSlug]/_hooks/mapStateInteraction/useMapDebugState'
import { useBackgroundParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useBackgroundParam'
import { useCategoriesConfig } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/useCategoriesConfig'
import { debugLayerStyles } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSubcategories/mapboxStyles/debugLayerStyles'
import { getSourceData } from '../../../_mapData/utils/getMapDataUtils'
import {
  createSourceKey,
  createSourceSubcatStyleLayerKey,
} from '../../utils/createKeyUtils/createKeyUtils'
import { layerVisibility } from '../utils/layerVisibility'
import { LayerHighlight } from './LayerHighlight'
import { beforeId } from './utils/beforeId'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'

// We add source+layer map-components for all categories and all subcategories of the given config.
// We then toggle the visibility of the layer base on the URL state (config).
// We also use this visbility to add/remove interactive layers.
//
// Performance Note:
// Maplibre GL JS will only create network request for sources that are used by a visible layer.
// But, it will create them again, when the source was unmounted.
// TODO / BUG: But, we still see network requests when we toggle the visibility like we do here. Which is fine for now, due to browser caching.
export const SourcesAndLayers = () => {
  const { useDebugLayerStyles } = useMapDebugState()
  const { categoriesConfig } = useCategoriesConfig()
  const { backgroundParam } = useBackgroundParam()

  if (!categoriesConfig?.length) return null

  return (
    <>
      {categoriesConfig.map((categoryConfig) => {
        return (
          <React.Fragment key={categoryConfig.id}>
            {categoryConfig.subcategories.map((subcategoryConfig) => {
              const sourceData = getSourceData(subcategoryConfig?.sourceId)

              // One source can be used by multipe subcategories, so we need to make the key source-category-specific.
              const sourceId = createSourceKey(
                categoryConfig.id,
                sourceData.id,
                subcategoryConfig.id,
              )

              return (
                <Source
                  key={sourceId}
                  id={sourceId}
                  type="vector"
                  tiles={[sourceData.tiles]}
                  minzoom={sourceData.minzoom || 4}
                  maxzoom={sourceData.maxzoom || 12}
                >
                  {subcategoryConfig.styles.map((styleConfig) => {
                    const currStyleConfig = subcategoryConfig.styles.find(
                      (s) => s.id === styleConfig.id,
                    )
                    const visibility = layerVisibility(
                      (categoryConfig.active && currStyleConfig?.active) || false,
                    )

                    return styleConfig?.layers?.map((layer) => {
                      const layerId = createSourceSubcatStyleLayerKey(
                        sourceData.id,
                        subcategoryConfig.id,
                        styleConfig.id,
                        layer.id,
                      )
                      const layout =
                        layer.layout === undefined ? visibility : { ...visibility, ...layer.layout }

                      // Use ?debugMap=true and <DebugMap> to setUseDebugLayerStyles
                      const layerFilter = useDebugLayerStyles
                        ? ['all']
                        : wrapFilterWithAll(layer.filter)

                      // Use ?debugMap=true and <DebugMap> to setUseDebugLayerStyles
                      const layerPaint = useDebugLayerStyles
                        ? debugLayerStyles({
                            source: sourceId,
                            sourceLayer: layer['source-layer'],
                          }).find((l) => l.type === layer.type)?.paint
                        : (layer.paint as any)

                      const layerProps = {
                        id: layerId,
                        source: sourceId,
                        type: layer.type,
                        'source-layer': layer['source-layer'],
                        layout: layout,
                        filter: layerFilter as FilterSpecification | undefined,
                        paint: layerPaint,
                        beforeId: beforeId({
                          backgroundId: backgroundParam,
                          subcategoryBeforeId: subcategoryConfig.beforeId,
                          layerType: layer.type,
                        }),
                        ...(layer.minzoom ? { minzoom: layer.minzoom } : {}),
                        ...(layer.maxzoom ? { maxzoom: layer.maxzoom } : {}),
                      }

                      return (
                        <React.Fragment key={layerId}>
                          <Layer key={layerId} {...layerProps} />
                          <LayerHighlight
                            key={`${layerId}_highlight`}
                            {...layerProps}
                            sourceData={sourceData}
                          />
                        </React.Fragment>
                      )
                    })
                  })}
                </Source>
              )
            })}
          </React.Fragment>
        )
      })}
    </>
  )
}
