import { LayoutMap } from '@components/Layout'
import { MapInterface } from '@components/MapInterface'
import { mapDataConfigTopicsWithState } from '@components/MapInterface/store'
import { LocationGenerics } from '@routes/routes'
import {
  Navigate,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location'
import { useEffect } from 'react'

export const PageRegionMap: React.FC = () => {
  const { theme, lat, lng, zoom, config } = useSearch<LocationGenerics>()
  const {
    data: { region },
    params: { regionPath },
  } = useMatch<LocationGenerics>()

  // Guard aganst false regionPath params which result in empty region-data
  if (!region) {
    return (
      <Navigate to="/regionen" search={{ regionPathNotFound: regionPath }} />
    )
  }

  // Guard against empty default searchParams, set them if any is missing (or empty)
  const navigate = useNavigate<LocationGenerics>()
  useEffect(() => {
    if (theme && lat && lng && zoom && config) return

    navigate({
      search: (old) => {
        return {
          lat: old?.lat ?? region.map.lat,
          lng: old?.lng ?? region.map.lng,
          zoom: old?.zoom ?? region.map.zoom,
          theme: old?.theme ?? 'surface', // TODO decide on a default theme on the region
          bg: 'default',
          config: mapDataConfigTopicsWithState({ themeId: 'surface' }), // TODO implement the theme feature, pick a default
        }
      },
      replace: true,
    })
  }, [theme, lat, lng, zoom, config])

  // NOTE: Might be used later to move the map…
  // const moveMap = ({
  //   lat,
  //   lng,
  //   zoom,
  // }: {
  //   lat: number
  //   lng: number
  //   zoom: number
  // }) => {
  //   navigate({
  //     search: (old) => {
  //       return { ...old, lat, lng, zoom }
  //     },
  //   })
  // }

  return (
    <LayoutMap>
      <MapInterface />
    </LayoutMap>
  )
}
