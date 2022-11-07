import { MapboxStylesByLayerGroup, mapboxStylesByLayerGroup } from '.'
import { SourcesIds } from '../../sourcesMapData'

type Props = {
  group: MapboxStylesByLayerGroup
  source: SourcesIds
  sourceLayer: string
}

export const mapboxStyleLayers = ({ group, source, sourceLayer }: Props) => {
  const mapboxLayers = mapboxStylesByLayerGroup.find(
    (g: any) => g.group === group
  )?.layers

  // Add required source id data that is not part of what we receive from the mapbox styles API
  mapboxLayers.forEach((layer: any) => {
    layer['source'] = source
    layer['source-layer'] = sourceLayer
  })

  return mapboxLayers
}
