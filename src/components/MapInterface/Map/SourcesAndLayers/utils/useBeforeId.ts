import { MapDataTopic, MapDataVisLayer, TBeforeIds } from '@components/MapInterface/mapData'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'

// We place our layers between given Maptiler Layer IDs:
// Key: LayerType – we group our data based on layer type.
// Value: Maptiler Layer ID that our layers are placed on top of.
// BUT: We only use this for our "default" background.
//    For custom raster backgrounds we place all our data on top.
const layerOrder: Record<string, TBeforeIds> = {
  symbol: 'housenumber', // Icon + Label
  circle: 'housenumber', // Points
  heatmap: 'housenumber',
  line: 'boundary_country',
  fill: 'landuse',
}

type Props = {
  topicData: MapDataTopic
  layerType: MapDataVisLayer['type']
}

export const useBeforeId = ({ topicData, layerType }: Props) => {
  const { bg: selectedBackgroundId } = useSearch<LocationGenerics>()

  // For all custom background (non 'default'), set beforeId=undefined which puts them at the top
  if (selectedBackgroundId !== 'default') return undefined

  // If a specific topic.beforeId is given (which might be `undefined`), take that
  // … otherwise pick the beforeId base on layer.type.
  return 'beforeId' in topicData ? topicData.beforeId : layerOrder[layerType]
}
