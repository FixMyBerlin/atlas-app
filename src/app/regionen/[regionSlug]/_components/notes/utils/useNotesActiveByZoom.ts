import { useMap } from 'react-map-gl/maplibre'

// Notes should only be loaded if Zoom 10 or higher
const minZoomNotesActive = 10
export const useNotesActiveByZoom = () => {
  const { mainMap } = useMap()
  const currentZoom = mainMap?.getZoom()
  if (!currentZoom) return false

  return currentZoom >= minZoomNotesActive
}
