import { type FilterSpecification, type LayerSpecification } from 'maplibre-gl'
import React from 'react'
import { Layer, LayerProps, Source, useMap } from 'react-map-gl/maplibre'
import { useMapDebugState } from 'src/app/regionen/[regionSlug]/_hooks/mapStateInteraction/useMapDebugState'
import { useBackgroundParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useBackgroundParam'
import { useCategoriesConfig } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/useCategoriesConfig'
import { debugLayerStyles } from 'src/app/regionen/[regionSlug]/_mapData/mapDataSubcategories/mapboxStyles/debugLayerStyles'
import { getSourceData } from '../../../_mapData/utils/getMapDataUtils'
import {
  createSourceKey,
  createSourceSubcatStyleLayerKey,
} from '../../utils/createKeyUtils/createKeyUtils'
import { LayerHighlight } from './LayerHighlight'
import { LayerVerificationStatus } from './LayerVerificationStatus'
import { beforeId } from './utils/beforeId'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'
import { makeTileUrlCacheless } from 'src/app/_components/utils/getTilesUrl'

// We add source+layer map-components for all categories and all subcategories of the given config.
// We then toggle the visibility of the layer base on the URL state (config).
// We also use this visbility to add/remove interactive layers.
export const SourcesAndLayers = () => {
  const { useDebugLayerStyles, useDebugCachelessTiles } = useMapDebugState()
  const { categoriesConfig } = useCategoriesConfig()
  const { backgroundParam } = useBackgroundParam()
  const map = useMap()?.current?.getMap()

  if (!map) return null
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

              const tileUrl = makeTileUrlCacheless({
                url: sourceData.tiles,
                cacheless: useDebugCachelessTiles,
              })

              return (
                <Source
                  key={sourceId}
                  id={sourceId}
                  type="vector"
                  tiles={[tileUrl]}
                  maxzoom={sourceData.maxzoom}
                  minzoom={sourceData.minzoom}
                >
                  {subcategoryConfig.styles.map((styleConfig) => {
                    const currStyleConfig = subcategoryConfig.styles.find(
                      (s) => s.id === styleConfig.id,
                    )

                    return styleConfig?.layers?.map((layer) => {
                      const layerId = createSourceSubcatStyleLayerKey(
                        sourceData.id,
                        subcategoryConfig.id,
                        styleConfig.id,
                        layer.id,
                      )

                      // Manually toggle layer visiblity
                      // This is a performance optimization because toggling layout.visibility causes a redownload of the tiles.
                      // We work around this by using setLayoutProperty manually.
                      // However, for some render passes the layer is not present, yet, which causes a crash, so we guard by checking if the layer exists.
                      const visibility = (categoryConfig.active && currStyleConfig?.active) || false
                      if (map.getLayer(layerId)) {
                        map.setLayoutProperty(
                          layerId,
                          'visibility',
                          visibility ? 'visible' : 'none',
                        )
                      }

                      // Use ?debugMap=true and <DebugMap> to setUseDebugLayerStyles
                      const layerFilter = useDebugLayerStyles
                        ? ['all']
                        : wrapFilterWithAll(layer.filter)
                      const layerPaint = useDebugLayerStyles
                        ? debugLayerStyles({
                            source: sourceId,
                            sourceLayer: layer['source-layer'],
                          }).find((l) => l.type === layer.type)?.paint
                        : layer.paint
                      const layerLayout = useDebugLayerStyles
                        ? debugLayerStyles({
                            source: sourceId,
                            sourceLayer: layer['source-layer'],
                          }).find((l) => l.type === layer.type)?.layout
                        : layer.layout

                      const layerProps = {
                        id: layerId,
                        source: sourceId,
                        type: layer.type,
                        'source-layer': layer['source-layer'],
                        ...(layerLayout ? { layout: layerLayout } : {}),
                        filter: layerFilter as FilterSpecification,
                        paint: layerPaint as any, // Too complex to apply all the different layer-type paint-types
                        beforeId: beforeId({
                          backgroundId: backgroundParam,
                          subcategoryBeforeId: subcategoryConfig.beforeId,
                          layerType: layer.type,
                        }),
                        ...(layer.maxzoom ? { maxzoom: layer.maxzoom } : {}),
                        ...(layer.minzoom ? { minzoom: layer.minzoom } : {}),
                      } satisfies LayerProps

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
                            <Layer key={layerId} {...layerProps} />
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
