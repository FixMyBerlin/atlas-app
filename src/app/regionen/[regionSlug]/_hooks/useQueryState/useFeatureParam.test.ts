import { describe, expect, test } from 'vitest'
import { pick } from 'lodash'
import { serializeFeaturesParam, parseFeaturesParam, convertToUrlFeature } from './useFeaturesParam'

const allTestData = [
  {
    map: {
      layer: {}, // not needed
      properties: {
        category: 'cycleway_adjoining', // not needed
        id: 'way/1122585766', // not needed
        osm_id: 1122585766,
        osm_type: 'W',
      },
      source: 'cat:bikelanes--source:atlas_bikelanes--subcat:bikelanes',
    },
    url: {
      sourceId: 'atlas_bikelanes',
      properties: {
        osm_id: 1122585766,
        osm_type: 'W',
      },
    },
    query: '9.W1122585766',
  },
  {
    map: {
      properties: {
        amenity: 'parking', // not needed
        id: 9718, // not needed
        osm_id: 412340597,
        osm_type: 'W',
      },
      source: 'cat:parking--source:parkraumParkingAreas--subcat:parkingAreas',
      _geometry: {}, // not needed
    },
    url: {
      sourceId: 'parkraumParkingAreas',
      properties: {
        osm_id: 412340597,
        osm_type: 'W',
      },
    },
    query: '4.W412340597',
  },
  {
    map: {
      type: 'Feature', // not needed
      properties: {
        captured_at: 1676466127394, // not needed
        id: 5379776588804171,
      },
      id: 2422, // not needed
      source: 'cat:mapillary--source:mapillary_coverage--subcat:mapillaryCoverage',
    },
    url: {
      properties: {
        id: 5379776588804171,
      },
      sourceId: 'mapillary_coverage',
    },
    query: '20.5379776588804171',
  },
]

describe('Test inspector url params', () => {
  const dataToTest = [2]

  const testData = Object.values(pick(allTestData, dataToTest))
  test('Convert array of map features to url features', () => {
    testData.forEach(({ map, url }) => {
      const converted = convertToUrlFeature(map as any)
      expect(url).toStrictEqual(converted)
    })
  })

  const urlFeatures = testData.map(({ url }) => url)
  const query = testData.map(({ query }) => query).join(',')
  test('Serialize url feature to query', () => {
    const serialized = serializeFeaturesParam(urlFeatures as any)
    expect(serialized).toBe(query)
  })

  test('Parse query to url feature', () => {
    const parsed = parseFeaturesParam('something,' + query)
    expect(parsed).toStrictEqual(urlFeatures)
  })
})
