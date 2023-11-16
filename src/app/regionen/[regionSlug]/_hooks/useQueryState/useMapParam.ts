import { createParser, useQueryState } from 'next-usequerystate'

export const useMapParam = () => {
  const fallback = { zoom: 12, lat: 52.507, lng: 13.367 }

  const mapParamParser = createParser({
    parse: (query: string) => ({
      zoom: Number(query.split('/')[0] ?? fallback.zoom),
      lat: Number(query.split('/')[1] ?? fallback.lat),
      lng: Number(query.split('/')[2] ?? fallback.lat),
    }),
    serialize: ({ zoom, lat, lng }: { zoom: number; lat: number; lng: number }) =>
      `${zoom}/${lat}/${lng}`,
  }).withOptions({ history: 'push' })

  const [mapParam, setMapParam] = useQueryState('map', mapParamParser)

  return { mapParam, setMapParam }
}
