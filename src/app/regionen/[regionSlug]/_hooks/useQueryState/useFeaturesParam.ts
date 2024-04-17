import { MapGeoJSONFeature } from 'react-map-gl'
import { pick, zip } from 'lodash'
import { bbox } from '@turf/turf'
import { z } from 'zod'
import { createParser, useQueryState } from 'next-usequerystate'
import { numericSourceIds } from 'src/app/url'
import { SourcesId } from '../../_mapData/mapDataSources/sources.const'
import { UrlFeature, SourceInfo } from './types'
import { chars, longitude, latitude, parseObject, number } from './util'
import { parseSourceKeyAtlasGeo } from '../../_components/utils/sourceKeyUtils/sourceKeyUtilsAtlasGeo'

const stringSourceIds = Object.fromEntries(Object.entries(numericSourceIds).map(([k, v]) => [v, k]))

export function parseSourceId(sourceId: SourcesId): SourceInfo {
  const type = sourceId.startsWith('mapillary_') ? 'mapillary' : 'osm'
  const table = sourceId.startsWith('atlas_') ? sourceId.split('atlas_')[1]! : null
  const internal = !!table
  return {
    id: sourceId, // the sourceId
    type, // wether the data is coming from osm or mapillary
    internal, // internal data - can be queried from database
    table, // the internal db table the data can be retrieved from
  }
}

export const convertToUrlFeature = (feature: MapGeoJSONFeature): UrlFeature => {
  const { properties, source, geometry } = feature
  const { sourceId } = parseSourceKeyAtlasGeo(source)
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

const Ids = [number(), z.union([number(), z.string()])]
const Point = [longitude, latitude]
// @ts-ignore - this work
const QuerySchema = z.union([z.tuple([...Ids, ...Point]), z.tuple([...Ids, ...Point, ...Point])])

export const parseFeaturesParam = (query: string) => {
  return query
    .split(',')
    .map((s) => {
      const parsed = parseObject(QuerySchema, s.split('|'))
      if (!parsed) return null
      const [numericSourceId, id, ...coordinates] = parsed
      const sourceId = numericSourceIds[numericSourceId]
      if (!sourceId) return null
      return {
        sourceId,
        properties: { id },
        coordinates,
      }
    })
    .filter((p) => p !== null) as unknown as UrlFeature[]
}

export const useFeaturesParam = () => {
  const featuresParamParser = createParser({
    parse: (query): UrlFeature[] => parseFeaturesParam(query),
    serialize: serializeFeaturesParam,
  }).withOptions({ history: 'push' })

  const [featuresParam, setFeaturesParam] = useQueryState('f', featuresParamParser)
  const featuresParamWithKeys: Record<string, UrlFeature> =
    featuresParam && featuresParam.length
      ? Object.fromEntries(zip(serializeFeaturesParam(featuresParam).split(','), featuresParam))
      : {}
  function resetFeaturesParam() {
    setFeaturesParam(null)
  }
  return { featuresParam, featuresParamWithKeys, setFeaturesParam, resetFeaturesParam }
}
