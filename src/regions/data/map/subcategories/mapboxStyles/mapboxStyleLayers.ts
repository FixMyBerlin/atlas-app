import { flattenFilterArrays } from 'src/app/regionen/[regionSlug]/_components/Map/SourcesAndLayers/utils/filterUtils/flattenFilterArrays'
import { wrapFilterWithAll } from 'src/app/regionen/[regionSlug]/_components/Map/SourcesAndLayers/utils/filterUtils/wrapFilterWithAll'
import { SourcesIds } from '../../sources/categorySources.const'
import rawMapboxStylesByLayerGroup from './mapbox-layer-styles-by-group.json'
import { MapboxStylesByLayerGroupIds } from './types'

type StylesByLayerGroup = { group: MapboxStylesByLayerGroupIds; layers: any }[]
export const mapboxStylesByLayerGroup = rawMapboxStylesByLayerGroup as StylesByLayerGroup

export type Props = {
  group: MapboxStylesByLayerGroupIds
  source: SourcesIds
  sourceLayer: string
  idPrefix?: string
  additionalFilter?: ['match', ['get', string], string[], boolean, boolean]
}

export const mapboxStyleLayers = ({
  group,
  source,
  sourceLayer,
  idPrefix,
  additionalFilter,
}: Props) => {
  const mapboxLayers = mapboxStylesByLayerGroup.find((g: any) => g.group === group)?.layers
  const mapboxLayersClone = structuredClone(mapboxLayers)

  if (!mapboxLayersClone) {
    console.error(
      'Error in `mapboxStyleLayers()`: Cannot find groupName in `mapboxStylesByLayerGroup`',
      {
        group,
        source,
        sourceLayer,
        mapboxStylesByLayerGroup,
      },
    )
    return undefined
  }

  // Add required source id data that is not part of what we receive from the mapbox styles API
  mapboxLayersClone.forEach((layer: any) => {
    layer['source'] = source
    layer['source-layer'] = sourceLayer
    layer.id = [idPrefix, layer.id].filter(Boolean).join('--')
    layer.filter = additionalFilter
      ? wrapFilterWithAll(flattenFilterArrays(layer.filter, additionalFilter))
      : layer.filter
  })

  return mapboxLayersClone
}
