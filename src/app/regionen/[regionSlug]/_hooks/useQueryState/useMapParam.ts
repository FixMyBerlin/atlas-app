import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { z } from 'zod'
import { range } from './util'

export const mapParamFallback = { lat: 52.5, lng: 13.4, zoom: 12.1 }

export type MapParam = {
  zoom: number
  lat: number
  lng: number
}

const MapParamSchema = z.tuple([range(0, 22), range(-90, 90), range(-180, 180)])

export const parseMapParam = (query: string): MapParam | null => {
  const parsed = MapParamSchema.safeParse(query.split('/'))
  if (!parsed.success) return null
  const [zoom, lat, lng] = parsed.data
  return { zoom, lat, lng }
}

export const serializeMapParam = ({ zoom, lat, lng }: MapParam): string => {
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
