import { createParser, useQueryState } from 'next-usequerystate'

export const useMapParam = () => {
  // const [lat, setLat] = useQueryState('lat', parseAsFloat.withDefault(region?.map?.lat || 52.507))
  // const [lng, setLng] = useQueryState('lng', parseAsFloat.withDefault(region?.map?.lng || 13.367))
  // const [zoom, setZoom] = useQueryState('zoom', parseAsFloat.withDefault(region?.map?.zoom || 12))

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
