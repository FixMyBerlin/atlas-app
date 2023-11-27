import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'

const fallback = { lat: 52.5, lng: 13.4, zoom: 12.1 }

const parseMapParam = (query: string) => {
  const splitQuery = query.split('/')
  return {
    zoom: Number(splitQuery[0] ?? fallback.zoom),
    lat: Number(splitQuery[1] ?? fallback.lat),
    lng: Number(splitQuery[2] ?? fallback.lng),
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
      zoom: Number(region.map?.zoom ?? fallback.zoom),
      lat: Number(region.map?.lat ?? fallback.lat),
      lng: Number(region.map?.lng ?? fallback.lng),
    })

  const [mapParam, setMapParam] = useQueryState('map', mapParamParser)

  return { mapParam, setMapParam }
}
