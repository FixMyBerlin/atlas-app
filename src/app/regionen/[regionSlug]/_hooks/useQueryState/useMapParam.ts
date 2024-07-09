import { createParser, useQueryState } from 'nuqs'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { parseMapParam, serializeMapParam } from './utils/mapParam'
import { searchParamsRegistry } from './searchParamsRegistry'
import { mapParamFallback } from './utils/mapParamFallback.const'

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

  const [mapParam, setMapParam] = useQueryState(searchParamsRegistry.map, mapParamParser)

  return { mapParam, setMapParam }
}
