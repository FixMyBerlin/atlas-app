import * as turf from '@turf/turf'

export const pointFromGeometry = (geometry: GeoJSON.Feature['geometry']) => {
  let lat = 0
  let lng = 0
  switch (geometry.type) {
    case 'Point': {
      lng = geometry.coordinates[0]!
      lat = geometry.coordinates[1]!
      break
    }
    case 'LineString': {
      const middle = geometry.coordinates[Math.floor(geometry.coordinates.length / 2) || 0]
      lng = middle![0]!
      lat = middle![1]!
      break
    }
    case 'Polygon': {
      const feature = turf.centerOfMass(turf.polygon(geometry.coordinates))
      lng = feature.geometry.coordinates[0]!
      lat = feature.geometry.coordinates[1]!
      break
    }
    default: {
      return [undefined, undefined]
    }
  }
  return [lng, lat]
}
