import { useMap } from 'react-map-gl/maplibre'

export const useBoundsBbox = () => {
  const { mainMap } = useMap()
  return mainMap
    ?.getBounds()
    .toArray()
    .flat()
    .map((coord) => coord.toFixed(3))
    .join(',')
}
