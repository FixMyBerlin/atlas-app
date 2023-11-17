import { createParser, useQueryState } from 'next-usequerystate'
import { TRegion } from 'src/regions/queries/getRegion'

export const useMapParam = (initialMap?: TRegion['map']) => {
  const fallback = { lat: 52.5, lng: 13.4, zoom: 12.1 }

  console.log('useMapParam', { initialMap, fallback })

  const mapParamParser = createParser({
    parse: (query: string) => {
      const splitQuery = query.split('/')
      return {
        zoom: Number(splitQuery[0] ?? fallback.zoom),
        lat: Number(splitQuery[1] ?? fallback.lat),
        lng: Number(splitQuery[2] ?? fallback.lng),
      }
    },
    serialize: ({ zoom, lat, lng }: { zoom: number; lat: number; lng: number }) => {
      return `${zoom}/${lat}/${lng}`
    },
  })
    .withOptions({ history: 'push' })
    .withDefault({
      zoom: Number(initialMap?.zoom ?? fallback.zoom),
      lat: Number(initialMap?.lat ?? fallback.lat),
      lng: Number(initialMap?.lng ?? fallback.lng),
    })

  const [mapParam, setMapParam] = useQueryState('map', mapParamParser)

  return { mapParam, setMapParam }
}
