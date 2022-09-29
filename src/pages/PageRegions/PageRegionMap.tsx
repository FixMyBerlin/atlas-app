import {
  Navigate,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location'
import { useEffect } from 'react'
import { LocationGenerics } from '../../routes'

export const PageRegionMap: React.FC = () => {
  const {
    data: { region },
    params: { regionPath },
  } = useMatch()

  if (region === undefined) {
    return (
      <Navigate to="/regionen" search={{ regionPathNotFound: regionPath }} />
    )
  }

  const navigate = useNavigate<LocationGenerics>()
  const { theme, lat, lng, zoom, config } = useSearch<LocationGenerics>()

  useEffect(() => {
    if (theme && lat && lng && zoom && config) return

    navigate({
      search: (old) => {
        return {
          lat: old?.lat ?? 52.4793,
          lng: old?.lng ?? 13.4381,
          zoom: old?.zoom ?? 16,
          theme: old?.theme ?? 'surface',
        }
      },
      replace: true,
    })
  }, [theme, lat, lng, zoom, config])

  const moveMap = ({
    lat,
    lng,
    zoom,
  }: {
    lat: number
    lng: number
    zoom: number
  }) =>
    navigate({
      search: (old) => {
        return {
          ...old,
          lat,
          lng,
          zoom,
        }
      },
    })

  return (
    <div>
      <h1>
        MAP {regionPath}: {JSON.stringify(region)}
      </h1>
      <button
        onClick={() =>
          moveMap({
            lat: Math.random(),
            lng: Math.random(),
            zoom: Math.random(),
          })
        }
      >
        Move Map
      </button>
    </div>
  )
  return <>{/* <MapInterface region={region} /> */}</>
}
