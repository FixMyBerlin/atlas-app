import * as turf from '@turf/turf'

export const pointFromGeometry = (
  geometry: maplibregl.GeoJSONFeature['geometry']
) => {
  let [lat, lng] = [0, 0]
  switch (geometry.type) {
    case 'Point': {
      ;[lng, lat] = geometry.coordinates
      break
    }
    case 'LineString': {
      const middle =
        geometry.coordinates[Math.floor(geometry.coordinates.length / 2) || 0]
      ;[lng, lat] = middle
      break
    }
    case 'Polygon': {
      const feature = turf.centerOfMass(turf.polygon(geometry.coordinates))
      ;[lng, lat] = feature.geometry.coordinates
      break
    }
    default: {
      return [undefined, undefined]
    }
  }
  return [lng, lat]
}
