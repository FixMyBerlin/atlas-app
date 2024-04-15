import { MapGeoJSONFeature } from 'react-map-gl'
import { pick, zip } from 'lodash'
import { bbox } from '@turf/turf'
import { z } from 'zod'
import { createParser, useQueryState } from 'next-usequerystate'
import { numericSourceIds } from 'src/app/url'
import { SourcesId } from '../../_mapData/mapDataSources/sources.const'
import { UrlFeature, SourceInfo, ParsedFeatureSource, OsmType } from './types'

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

export function parseFeatureSource(source: string): ParsedFeatureSource {
  // source: "cat:mapillary--source:mapillary_coverage--subcat:mapillaryCoverage"
  // returns: { categoryId: 'mapillary', sourceId: 'mapillary_coverage', subcategoryId: 'mapillaryCoverage' }
  return Object.fromEntries(
    source
      .split('--')
      .map((s) => s.split(':'))
      .map(([k, v]) => [
        {
          cat: 'categoryId',
          source: 'sourceId',
          subcat: 'subcategoryId',
        }[k!],
        v,
      ]),
  )
}

export const convertToUrlFeature = (feature: MapGeoJSONFeature): UrlFeature => {
  const { properties, source, geometry } = feature
  const sourceId = parseFeatureSource(source).sourceId
  const { type, internal } = parseSourceId(sourceId as SourcesId)
  const data: any = {
    properties: pick(properties, type === 'osm' ? ['osm_id', 'osm_type'] : ['id']),
    sourceId: parseFeatureSource(source).sourceId,
  }
  if (geometry.type === 'Point') data.point = geometry.coordinates
  else data.bbox = bbox(feature.geometry).map((v) => Number(v.toFixed(6)))
  return data
}

export const serializeFeaturesParam = (urlFeatures: UrlFeature[]): string => {
  return urlFeatures
    .map((f) => {
      const {
        sourceId,
        // @ts-expect-error
        properties: { id, osm_id, osm_type },
      } = f
      const numericSourceId = stringSourceIds[sourceId]
      const type = parseSourceId(sourceId as SourcesId).type
      const idString = type === 'osm' ? osm_type! + '|' + osm_id! : String(id)
      const geomType = 'point' in f ? 'P' : 'B'
      const geomCoords = (f.point || f.bbox).map((v) => v.toFixed(6))
      return [numericSourceId, idString, geomType, ...geomCoords].join('|')
    })
    .join(',')
}

const number = z.coerce.number
const range = (min, max) => number().gte(min).lte(max)
const lng = range(-180, 180)
const lat = range(-90, 90)
const equals = (v) => range(v, v)
const chars = (s) => z.enum(s.split(''))

const MappilarySchema = z.tuple([
  equals(1), // 'mapillary_coverage'
  number(),
  chars('P'),
  lng,
  lat,
])

const OsmSchema = z.tuple([
  number().gte(20),
  chars('WNR'),
  number(),
  chars('B'),
  lng,
  lat,
  lng,
  lat,
])

function parse(schema, query) {
  try {
    return schema.parse(query.split('|'))
  } catch (e) {
    return null
  }
}

export const parseFeaturesParam = (query: string) => {
  return query
    .split(',')
    .map((s) => {
      const osm = parse(OsmSchema, s)
      const mappilary = parse(MappilarySchema, s)
      if (!(osm || mappilary)) return null
      let properties
      if (osm) {
        var [numericSourceId, osm_type, osm_id, geomType, ...coords] = osm
        properties = { osm_type, osm_id }
      } else {
        var [numericSourceId, id, geomType, ...coords] = mappilary
        properties = { id }
      }
      const sourceId = numericSourceIds[numericSourceId]
      if (!sourceId) return null

      return {
        sourceId,
        properties,
        [geomType === 'P' ? 'point' : 'bbox']: coords,
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
