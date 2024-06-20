import { z } from 'zod'
import { roundPositionForURL } from './roundNumber'
import { range } from './zodHelper'

export type MapParam = {
  zoom: number
  lat: number
  lng: number
}

const MapParamSchema = z.tuple([range(0, 22), range(-90, 90), range(-180, 180)])

export const parseMapParam = (query: string) => {
  let parsed: any
  // check if this could be a position from google maps
  const m = query.match('^@(.*)z$')
  if (m) {
    const [lat, lng, zoom] = m[1]!.split(',')
    parsed = MapParamSchema.safeParse([zoom, lat, lng])
  } else {
    parsed = MapParamSchema.safeParse(query.split('/'))
  }
  if (!parsed.success) return null
  const [zoom, lat, lng] = parsed.data
  return { zoom, lat, lng } satisfies MapParam
}

export const serializeMapParam = ({ zoom, lat, lng }: MapParam): string => {
  const [roundedLat, roundedLng, roundedZoom] = roundPositionForURL(lat, lng, zoom)
  return `${roundedZoom}/${roundedLat}/${roundedLng}`
}
