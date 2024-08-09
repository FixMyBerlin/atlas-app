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
import { parseSourceKeyStaticDatasets } from '../../../_components/utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import adler32 from 'adler-32'
import { useRegionDatasets } from '../../useRegionDatasets/useRegionDatasets'

const memoizer = createMemoizer()

const stringSourceIds = Object.fromEntries(Object.entries(numericSourceIds).map(([k, v]) => [v, k]))

function adlerChecksum(s: string) {
  return new Uint32Array([adler32.str(s)])[0]!
}

export const convertToUrlFeature = (feature: MapGeoJSONFeature): UrlFeature => {
  const { id, source, geometry } = feature
  let sourceId: string
  const atlasGeoSourceId = parseSourceKeyAtlasGeo(source).sourceId
  if (source === 'osm-notes') {
    sourceId = 'osm-notes'
  } else if (atlasGeoSourceId) {
    sourceId = atlasGeoSourceId
  } else {
    sourceId = parseSourceKeyStaticDatasets(source).sourceId as string
  }
  const data: any = {
    id,
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
      const { id, sourceId, coordinates } = f
      const numericSourceId = stringSourceIds[sourceId] || adlerChecksum(sourceId)
      return [numericSourceId, id, ...coordinates].join('|')
    })
    .join(',')
}

const Ids = [z.coerce.number(), z.union([z.coerce.number(), z.string()])]
const Point = [longitude, latitude]
// @ts-expect-errors - this work
const QuerySchema = z.union([z.tuple([...Ids, ...Point]), z.tuple([...Ids, ...Point, ...Point])])

export const parseFeaturesParam = memoize((query: string) => {
  const regionDatasets = useRegionDatasets()
  const checksumToDatasetId = Object.fromEntries(
    regionDatasets.map((r) => [adlerChecksum(r.id), r.id]),
  )
  return query
    .split(',')
    .map((s) => {
      const parsed = QuerySchema.safeParse(s.split('|'))
      if (!parsed.success) return null
      const [numericSourceId, id, ...coordinates] = parsed.data
      let sourceId: undefined | string = numericSourceIds[numericSourceId]
      if (!sourceId) sourceId = checksumToDatasetId[numericSourceId]
      if (!sourceId) return null
      return {
        id,
        sourceId,
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
