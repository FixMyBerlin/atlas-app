import { useMapBounds } from '../../../../_hooks/mapState/useMapState'

export const useBbox = () => {
  const mapBounds = useMapBounds()
  const bbox = mapBounds
    ?.toArray()
    ?.flat()
    ?.map((coord) => coord.toFixed(3))
    ?.join(',')

  return bbox
}
