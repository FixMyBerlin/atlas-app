import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'

export const mapParamFallback = { lat: 52.5, lng: 13.4, zoom: 12.1 }

export const parseMapParam = (query: string) => {
  const [zoom, lat, lng] = query.split('/').map((s) => {
    const n = Number(s)
    return isNaN(n) ? null : n
  })
  if ([zoom, lat, lng].includes(null)) return null
  // https://docs.mapbox.com/help/glossary/zoom-level/
  if (zoom! < 0 || zoom! > 22) return null
  if (lat! < -90 || lat! > 90) return null
  if (lng! < -180 || lng! > 180) return null
  return { zoom, lat, lng }
}

export const serializeMapParam = ({
  zoom,
  lat,
  lng,
}: {
  zoom: number
  lat: number
  lng: number
}) => {
  return `${zoom}/${lat}/${lng}`
}

export const useMapParam = () => {
  const region = useStaticRegion()

  const mapParamParser = createParser({
    parse: (query) => parseMapParam(query),
    serialize: (object) => serializeMapParam(object),
  })
    .withOptions({ history: 'push' })
    .withDefault({
      zoom: Number(region?.map?.zoom ?? mapParamFallback.zoom),
      lat: Number(region?.map?.lat ?? mapParamFallback.lat),
      lng: Number(region?.map?.lng ?? mapParamFallback.lng),
    })

  const [mapParam, setMapParam] = useQueryState('map', mapParamParser)

  return { mapParam, setMapParam }
}
