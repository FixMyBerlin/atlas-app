import { FilterSpecification } from 'maplibre-gl'
import React from 'react'
import { Layer, LayerProps, Source } from 'react-map-gl/maplibre'
import { useMapDebugState } from 'src/app/regionen/[regionSlug]/_components/mapStateInteraction/useMapDebugState'
import { useBackgroundParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useBackgroundParam'
import { useConfigParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParam'
import { debugLayerStyles } from 'src/regions/data/map/subcategories/mapboxStyles/debugLayerStyles'
import {
  getSourceData,
  getStyleData,
  getSubcategoryData,
} from 'src/regions/data/map/utils/getMapDataUtils'
import {
  createSourceKey,
  createSourceSubcatStyleLayerKey,
} from '../../utils/createKeyUtils/createKeyUtils'
import { layerVisibility } from '../utils/layerVisibility'
import { LayerHighlight } from './LayerHighlight'
import { LayerVerificationStatus } from './LayerVerificationStatus'
import { beforeId } from './utils/beforeId'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'

// We add source+layer map-components for all categories and all subcategories of the given config.
// We then toggle the visibility of the layer base on the URL state (config).
// We also use this visbility to add/remove interactive layers.
//
// Performance Note:
// Maplibre GL JS will only create network request for sources that are used by a visible layer.
// However, we do not want to bloat our DOM, so we only render active categories and subcategories.
export const SourcesAndLayers = () => {
  const { useDebugLayerStyles } = useMapDebugState()
  const { configParam } = useConfigParam()
  const { backgroundParam } = useBackgroundParam()

  const activeConfigCategories = configParam?.filter((th) => th.active === true)
  if (!activeConfigCategories?.length) return null

  return (
    <>
      {activeConfigCategories.map((activeConfigCategory) => {
        return (
          <React.Fragment key={activeConfigCategory.id}>
            {activeConfigCategory.subcategories.map((subcategoryConfig) => {
              const curSubcatData = getSubcategoryData(subcategoryConfig.id)
              const sourceData = getSourceData(curSubcatData?.sourceId)

              // One source can be used by multipe subcategories, so we need to make the key source-category-specific.
              const sourceId = createSourceKey(
                activeConfigCategory.id,
                sourceData.id,
                subcategoryConfig.id,
              )

              return (
                <Source
                  key={sourceId}
                  id={sourceId}
                  type="vector"
                  tiles={[sourceData.tiles]}
                  minzoom={sourceData.minzoom || 8}
                  maxzoom={sourceData.maxzoom || 22}
                >
                  {subcategoryConfig.styles.map((styleConfig) => {
                    const styleData = getStyleData(curSubcatData, styleConfig.id)

                    if (styleConfig.id === 'hidden') {
                      const layerId = createSourceSubcatStyleLayerKey(
                        sourceData.id,
                        subcategoryConfig.id,
                        styleConfig.id,
                        'hidden',
                      )
                      return (
                        <Layer
                          key={layerId}
                          id={layerId}
                          source-layer={sourceId}
                          type="line"
                          layout={{ visibility: 'none' }}
                        />
                      )
                    }

                    const currStyleConfig = subcategoryConfig.styles.find(
                      (s) => s.id === styleConfig.id,
                    )
                    const visibility = layerVisibility(currStyleConfig?.active || false)

                    return styleData?.layers?.map((layer) => {
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
                          subcategoryData: curSubcatData,
                          layerType: layer.type,
                        }),
                      }

                      // The verification style layer in Mapbox Studio has to include this string
                      const isVerificationStatusLayer = layer.id.search('verification-status') != -1

                      return (
                        <React.Fragment key={layerId}>
                          {isVerificationStatusLayer ? (
                            <LayerVerificationStatus
                              key={`${layerId}_verification`}
                              {...layerProps}
                            />
                          ) : (
                            <Layer key={layerId} {...(layerProps as LayerProps)} />
                          )}
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
