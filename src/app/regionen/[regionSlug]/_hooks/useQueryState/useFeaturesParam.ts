import { pick, zip } from 'lodash'
import { createParser, useQueryState } from 'next-usequerystate'
import { numericSourceIds } from 'src/app/url'
import { SourcesId } from '../../_mapData/mapDataSources/sources.const'
import { UrlFeature, SourceInfo, ParsedFeatureSource } from './types'
import { MapGeoJSONFeature } from 'react-map-gl'

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
  const { properties, source } = feature
  return {
    properties: pick(properties, ['id', 'osm_id', 'osm_type']),
    sourceId: parseFeatureSource(source).sourceId,
  }
}

export const serializeFeaturesParam = (urlFeatures: UrlFeature[]): string => {
  return urlFeatures
    .map((f) => {
      const {
        sourceId,
        properties: { id, osm_id, osm_type },
      } = f
      const numericSourceId = stringSourceIds[sourceId]
      return [numericSourceId, id || '', osm_id || '', osm_type || ''].join('.')
    })
    .join(',')
}

export const parseFeaturesParam = (query: string) => {
  return query
    .split(',')
    .map((s) => {
      let [numericSourceIdString, idString, osmIdString, osm_type] = s.split('.')
      const numericSourceId = Number(numericSourceIdString)
      const osm_id = Number(osmIdString)
      if (
        !(numericSourceId! in numericSourceIds) ||
        !['', 'N', 'W', 'R'].includes(osm_type!) ||
        isNaN(osm_id)
      )
        return null
      const sourceId = numericSourceIds[Number(numericSourceId)]!
      const idNumber = Number(idString)
      const id = isNaN(idNumber) ? idString : idNumber
      const properties = Object.fromEntries(
        Object.entries({
          id,
          osm_id,
          osm_type,
        }).filter(([k, v]) => !!v),
      )
      return {
        sourceId,
        properties,
      }
    })
    .filter((p) => p !== null) as UrlFeature[]
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
