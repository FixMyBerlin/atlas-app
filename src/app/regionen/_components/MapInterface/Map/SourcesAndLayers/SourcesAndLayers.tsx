'use client'

import { FilterSpecification } from 'maplibre-gl'
import React from 'react'
import { Layer, LayerProps, Source } from 'react-map-gl/maplibre'
import { debugLayerStyles } from 'src/app/regionen/_components/MapInterface/mapData/topicsMapData/mapboxStyles/debugLayerStyles'
import { useMapDebugState } from 'src/app/regionen/_components/MapInterface/mapStateInteraction/useMapDebugState'
import { useBackgroundParam } from 'src/app/regionen/_components/useQueryState/useBackgroundParam'
import { useConfigParam } from 'src/app/regionen/_components/useQueryState/useConfigParam'
import { getSourceData, getStyleData, getTopicData } from '../../mapData/utils/getMapDataUtils'
import {
  createSourceKey,
  createSourceTopicStyleLayerKey,
} from '../../utils/createKeyUtils/createKeyUtils'
import { layerVisibility } from '../utils/layerVisibility'
import { LayerHighlight } from './LayerHighlight'
import { LayerVerificationStatus } from './LayerVerificationStatus'
import { beforeId } from './utils/beforeId'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'

// We add source+layer map-components for all themes and all topics of the given config.
// We then toggle the visibility of the layer base on the URL state (config).
// We also use this visbility to add/remove interactive layers.
//
// Performance Note:
// Maplibre GL JS will only create network request for sources that are used by a visible layer.
// However, we do not want to bloat our DOM, so we only render active themes and topics.
export const SourcesAndLayers: React.FC = () => {
  const { useDebugLayerStyles } = useMapDebugState()
  const { configParam } = useConfigParam()
  const { backgroundParam } = useBackgroundParam()

  const activeConfigThemes = configParam?.filter((th) => th.active === true)
  if (!activeConfigThemes?.length) return null

  return (
    <>
      {activeConfigThemes.map((activeConfigTheme) => {
        return (
          <React.Fragment key={activeConfigTheme.id}>
            {activeConfigTheme.topics.map((topicConfig) => {
              const curTopicData = getTopicData(topicConfig.id)
              const sourceData = getSourceData(curTopicData?.sourceId)

              // One source can be used by multipe topics, so we need to make the key source-topic-specific.
              const sourceId = createSourceKey(activeConfigTheme.id, sourceData.id, topicConfig.id)

              return (
                <Source
                  key={sourceId}
                  id={sourceId}
                  type="vector"
                  tiles={[sourceData.tiles]}
                  minzoom={sourceData.minzoom || 8}
                  maxzoom={sourceData.maxzoom || 22}
                >
                  {topicConfig.styles.map((styleConfig) => {
                    const styleData = getStyleData(curTopicData, styleConfig.id)

                    if (styleConfig.id === 'hidden') {
                      const layerId = createSourceTopicStyleLayerKey(
                        sourceData.id,
                        topicConfig.id,
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

                    // A style is visible when
                    // … the theme is active (handled above) AND
                    // … the current topic is active AND
                    //               ^--- TODO This is wrong now, topics are always active but themes get active/hidden
                    // … the current topic's style is active (which includes 'default' via the config initialization)
                    const currStyleConfig = topicConfig.styles.find((s) => s.id === styleConfig.id)
                    const visibility = layerVisibility(currStyleConfig?.active || false)

                    // TODO MIGRATION
                    return styleData?.layers?.map((layer) => {
                      const layerId = createSourceTopicStyleLayerKey(
                        sourceData.id,
                        topicConfig.id,
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
                          topicData: curTopicData,
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
