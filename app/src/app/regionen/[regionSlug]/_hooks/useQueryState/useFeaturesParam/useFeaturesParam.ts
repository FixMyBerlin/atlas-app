import { bbox } from '@turf/turf'
import { createParser, useQueryState } from 'nuqs'
import { MapGeoJSONFeature } from 'react-map-gl/maplibre'
import { numericSourceIds } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useFeaturesParam/url'
import { z } from 'zod'
import { parseSourceKeyAtlasGeo } from '../../../_components/utils/sourceKeyUtils/sourceKeyUtilsAtlasGeo'
import { searchParamsRegistry } from '../searchParamsRegistry'
import { UrlFeature } from '../types'
import { latitude, longitude } from '../utils/zodHelper'
import { createMemoizer } from '../utils/createMemoizer'
import { memoize } from 'lodash'

const memoizer = createMemoizer()

const stringSourceIds = Object.fromEntries(Object.entries(numericSourceIds).map(([k, v]) => [v, k]))

export const convertToUrlFeature = (feature: MapGeoJSONFeature): UrlFeature => {
  const { properties, source, geometry } = feature
  const sourceId = source === 'osm-notes' ? 'osm-notes' : parseSourceKeyAtlasGeo(source).sourceId
  const data: any = {
    properties: { id: properties!.id },
    sourceId,
    coordinates: (geometry.type === 'Point' ? geometry.coordinates : bbox(geometry)).map((v) =>
      Number(v.toFixed(6)),
    ),
  }
  return data
}

export const serializeFeaturesParam = (urlFeatures: UrlFeature[]): string => {
  return urlFeatures
    .map((f) => {
      const {
        sourceId,
        properties: { id },
        coordinates,
      } = f
      const numericSourceId = stringSourceIds[sourceId]
      return [numericSourceId, id, ...coordinates].join('|')
    })
    .join(',')
}

const Ids = [z.coerce.number(), z.union([z.coerce.number(), z.string()])]
const Point = [longitude, latitude]
// @ts-expect-errors - this work
const QuerySchema = z.union([z.tuple([...Ids, ...Point]), z.tuple([...Ids, ...Point, ...Point])])

export const parseFeaturesParam = memoize((query: string) => {
  return query
    .split(',')
    .map((s) => {
      const parsed = QuerySchema.safeParse(s.split('|'))
      if (!parsed.success) return null
      const [numericSourceId, id, ...coordinates] = parsed.data
      const sourceId = numericSourceIds[numericSourceId]
      if (!sourceId) return null
      return {
        sourceId,
        properties: { id },
        coordinates,
      }
    })
    .filter((p) => p !== null) as unknown as UrlFeature[]
})

const featuresParamParser = createParser({
  parse: (query): UrlFeature[] => parseFeaturesParam(query),
  serialize: serializeFeaturesParam,
}).withOptions({ history: 'push' })

export const useFeaturesParam = () => {
  const [featuresParam, setFeaturesParam] = useQueryState(
    searchParamsRegistry.f,
    featuresParamParser,
  )
  return memoizer({ featuresParam, setFeaturesParam })
}
