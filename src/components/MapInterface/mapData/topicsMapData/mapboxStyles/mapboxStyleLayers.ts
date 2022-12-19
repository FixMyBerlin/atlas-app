import { mapboxStylesByLayerGroup, MapboxStylesByLayerGroupIds } from '.'
import { SourcesIds } from '../../sourcesMapData'

type Props = {
  group: MapboxStylesByLayerGroupIds
  source: SourcesIds
  sourceLayer: string
}

const debugStyleLayer = ({
  source,
  sourceLayer,
}: Pick<Props, 'source' | 'sourceLayer'>) => {
  // TODO: Right now this will only work for type=line; it needs refactoring to work with points and areas.
  return [
    {
      id: 'debugStyleLayer',
      type: 'line',
      source: source,
      'source-layer': sourceLayer,
      paint: {
        'line-width': 20,
        'line-color': '#a21caf',
        'line-opacity': 0.6,
      },
      layout: {},
    },
  ]
}

// This is for debugging. We might want to put this into a state, later.
const useDebugStyle = false

export const mapboxStyleLayers = ({ group, source, sourceLayer }: Props) => {
  if (useDebugStyle) {
    return debugStyleLayer({ source, sourceLayer })
  }

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
