import { createParser, useQueryState } from 'nuqs'
import { parseMapParam, serializeMapParam } from './utils/mapParam'
import { searchParamsRegistry } from './searchParamsRegistry'
import { mapParamFallback } from './utils/mapParamFallback.const'
import { createMemoizer } from './utils/createMemoizer'

const memoizer = createMemoizer()

const mapParamParser = createParser({
  parse: (query) => parseMapParam(query),
  serialize: (object) => serializeMapParam(object),
})
  .withOptions({ history: 'push' })
  .withDefault({
    zoom: mapParamFallback.zoom,
    lat: mapParamFallback.lat,
    lng: mapParamFallback.lng,
  })

export const useMapParam = () => {
  const [mapParam, setMapParam] = useQueryState(searchParamsRegistry.map, mapParamParser)
  return memoizer({ mapParam, setMapParam })
}
