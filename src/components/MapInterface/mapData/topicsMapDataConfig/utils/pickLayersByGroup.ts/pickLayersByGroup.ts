import { MapDataVisLayer } from '@components/MapInterface/mapData/types'

export const pickLayersByGroup = (layers: any[], groupName: string) => {
  return layers.filter(
    (s) => s.metadata.groupName === groupName
  ) as MapDataVisLayer[]
}
