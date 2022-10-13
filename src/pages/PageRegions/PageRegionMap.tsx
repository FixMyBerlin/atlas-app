import { LayoutMap } from '@components/Layout'
import { MapInterface } from '@components/MapInterface'
import { createMapRegionConfig } from '@components/MapInterface/mapStateConfig'
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
      <Navigate
        to="/regionen"
        search={{ regionPathNotFound: regionPath }}
        replace
      />
    )
  }

  // Guard against empty default searchParams, set them if any is missing (or empty)
  const navigate = useNavigate<LocationGenerics>()
  useEffect(() => {
    if (theme && lat && lng && zoom && config) return

    navigate({
      search: (old) => {
        const initialConfig = createMapRegionConfig({
          regionThemeIds: region.themes,
        })
        return {
          lat: old?.lat ?? region.map.lat,
          lng: old?.lng ?? region.map.lng,
          zoom: old?.zoom ?? region.map.zoom,
          theme: old?.theme ?? initialConfig?.[0]?.id ?? 'fromTo',
          bg: 'default',
          config: initialConfig,
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
