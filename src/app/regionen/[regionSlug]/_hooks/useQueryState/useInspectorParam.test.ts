import { describe, expect, test } from 'vitest'
import { serializeFeaturesParam, parseFeaturesParam, convertToUrlFeature } from './useFeaturesParam'
import { UrlFeature } from './types'

describe('Test inspector url params', () => {
  const features = [
    {
      layer: {}, // not needed
      properties: {
        category: 'cycleway_adjoining', // not needed
        id: 'way/1122585766',
        osm_id: 1122585766,
        osm_type: 'W',
      },
      source: 'cat:bikelanes--source:atlas_bikelanes--subcat:bikelanes',
    },
    {
      properties: {
        amenity: 'parking', // not needed
        id: 9718,
        osm_id: 412340597,
        osm_type: 'W',
      },
      source: 'cat:parking--source:parkraumParkingAreas--subcat:parkingAreas',
      _geometry: {}, // not needed
    },
    {
      type: 'Feature', // not needed
      properties: {
        captured_at: 1676466127394, // not needed
        id: 5379776588804171,
      },
      id: 2422, // not needed
      source: 'cat:mapillary--source:mapillary_coverage--subcat:mapillaryCoverage',
    },
  ]
  const param: UrlFeature[] = [
    {
      sourceId: 'atlas_bikelanes',
      properties: {
        id: 'way/1122585766',
        osm_id: 1122585766,
        osm_type: 'W',
      },
    },
    {
      sourceId: 'parkraumParkingAreas',
      properties: {
        id: 9718,
        osm_id: 412340597,
        osm_type: 'W',
      },
    },
    {
      properties: {
        id: 5379776588804171,
      },
      sourceId: 'mapillary_coverage',
    },
  ]
  const query = '9.way/1122585766.1122585766.W,4.9718.412340597.W,20.5379776588804171..'
  test('Convert array of map features to param', () => {
    features.forEach((feature, i) => {
      const converted = convertToUrlFeature(feature)
      expect(param[i]).toStrictEqual(converted)
    })
  })
  test('Serialize param to query', () => {
    const serialized = serializeFeaturesParam(param)
    expect(serialized).toBe(query)
  })
  test('Parse query to param', () => {
    const parsed = parseFeaturesParam('999.way/123.123.W,' + query)
    expect(parsed).toStrictEqual(param)
  })
})
