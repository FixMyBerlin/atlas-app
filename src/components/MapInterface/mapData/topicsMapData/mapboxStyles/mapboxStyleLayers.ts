import { mapboxStylesByLayerGroup, MapboxStylesByLayerGroupIds } from '.'
import { SourcesIds } from '../../sourcesMapData'

type Props = {
  group: MapboxStylesByLayerGroupIds
  source: SourcesIds
  sourceLayer: string
}

export const mapboxStyleLayers = ({ group, source, sourceLayer }: Props) => {
  const mapboxLayers = mapboxStylesByLayerGroup.find(
    (g: any) => g.group === group
  )?.layers
  const mapboxLayersClone = structuredClone(mapboxLayers)

  if (!mapboxLayersClone) {
    console.error(
      'Error in `mapboxStyleLayers()`: Cannot find groupName in `mapboxStylesByLayerGroup`',
      {
        group,
        source,
        sourceLayer,
        mapboxStylesByLayerGroup,
      }
    )
    return undefined
  }

  // Add required source id data that is not part of what we receive from the mapbox styles API
  mapboxLayersClone.forEach((layer: any) => {
    layer['source'] = source
    layer['source-layer'] = sourceLayer
  })

  return mapboxLayersClone
}
