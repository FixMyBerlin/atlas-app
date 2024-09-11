import { centerOfMass, feature, length, lineSliceAlong, lineString, polygon } from '@turf/turf'

type ReturnPosition = [number, number]

// Case: When the geometry array is empty, we fall back to a place near Helgoland.
const fallback = [8.1441836, 54.09762] as const satisfies ReturnPosition

const pointOnMiddleOfLinestring = (geometry: GeoJSON.LineString) => {
  const halfLength = length(feature(geometry), { units: 'meters' }) / 2
  const wayToHalf = lineSliceAlong(geometry, 0, halfLength, {
    units: 'meters',
  })

  const lng = wayToHalf.geometry.coordinates.at(-1)?.at(0) || fallback[0]
  const lat = wayToHalf.geometry.coordinates.at(-1)?.at(1) || fallback[1]
  return [lng, lat] satisfies ReturnPosition
}

// TS Note: For some reason I need to add the return type once I add the recursion at the end.
export const pointFromGeometry = (geometry: GeoJSON.Feature['geometry']): ReturnPosition => {
  switch (geometry.type) {
    case 'Point': {
      const lng = geometry.coordinates[0] || fallback[0]
      const lat = geometry.coordinates[1] || fallback[1]
      return [lng, lat] satisfies ReturnPosition
    }
    case 'MultiPoint': {
      // Never happens, so we just force the first point
      const lng = geometry.coordinates[0]?.[0] || fallback[0]
      const lat = geometry.coordinates[0]?.[1] || fallback[1]
      return [lng, lat] satisfies ReturnPosition
    }
    case 'LineString': {
      return pointOnMiddleOfLinestring(geometry)
    }
    case 'MultiLineString': {
      // We take the center of the longest segment
      let longestLine = geometry.coordinates[0]!
      let maxLength = length(lineString(longestLine))
      for (const line of geometry.coordinates) {
        const innerLength = length(lineString(line))
        if (innerLength > maxLength) {
          longestLine = line
          maxLength = innerLength
        }
      }

      const longestLineLinestring = lineString(longestLine).geometry
      return pointOnMiddleOfLinestring(longestLineLinestring)
    }
    case 'Polygon': {
      const feature = centerOfMass(polygon(geometry.coordinates))
      const lng = feature.geometry.coordinates[0] || fallback[0]
      const lat = feature.geometry.coordinates[1] || fallback[1]
      return [lng, lat] satisfies ReturnPosition
    }
    case 'MultiPolygon': {
      // This is not the best point. But we can always improve it to take the center of the largest Polygon
      const feature = centerOfMass(geometry.coordinates)
      const lng = feature.geometry.coordinates[0] || fallback[0]
      const lat = feature.geometry.coordinates[1] || fallback[1]
      return [lng, lat] satisfies ReturnPosition
    }
    case 'GeometryCollection': {
      // `GeometryCollection` are an array of Point|LineString|Polygon|….
      // This should never happen for our data, so we just pick the first to create a center.
      const firstCollectionItem = geometry.geometries[0]
      if (!firstCollectionItem) {
        return fallback
      }
      return pointFromGeometry(firstCollectionItem)
    }
  }
}
