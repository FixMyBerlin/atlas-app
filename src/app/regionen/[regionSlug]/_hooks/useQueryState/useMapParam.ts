import { createParser, useQueryState } from 'next-usequerystate'

export const useMapParam = () => {
  const fallback = { zoom: 12, lat: 52.507, lng: 13.367 }

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
  }).withOptions({ history: 'push' })

  const [mapParam, setMapParam] = useQueryState('map', mapParamParser)

  return { mapParam, setMapParam }
}
