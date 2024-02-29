import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'

export const mapParamFallback = { lat: 52.5, lng: 13.4, zoom: 12.1 }

const parseMapParam = (query: string) => {
  const splitQuery = query.split('/')
  return {
    zoom: Number(splitQuery[0] ?? mapParamFallback.zoom),
    lat: Number(splitQuery[1] ?? mapParamFallback.lat),
    lng: Number(splitQuery[2] ?? mapParamFallback.lng),
  }
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
