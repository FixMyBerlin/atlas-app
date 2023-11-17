import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/(pages)/_components/regionUtils/useStaticRegion'

export const useMapParam = () => {
  const region = useStaticRegion()
  const fallback = { lat: 52.5, lng: 13.4, zoom: 12.1 }

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
      zoom: Number(region.map?.zoom ?? fallback.zoom),
      lat: Number(region.map?.lat ?? fallback.lat),
      lng: Number(region.map?.lng ?? fallback.lng),
    })

  const [mapParam, setMapParam] = useQueryState('map', mapParamParser)

  console.log('#### useMapParam', { initialMap: region.map, fallback, mapParam })

  return { mapParam, setMapParam }
}
