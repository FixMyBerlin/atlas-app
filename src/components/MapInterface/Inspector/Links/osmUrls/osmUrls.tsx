const osmType = { W: 'way', N: 'node', R: 'relation' }

export const osmUrl = (type: 'W' | 'N' | 'R', id: number) => {
  if (!osmType[type]) return undefined
  return `https://www.openstreetmap.org/${osmType[type]}/${id}`
}

export const historyUrl = (type: 'W' | 'N' | 'R', id: number) => {
  if (!osmType[type]) return undefined
  return `https://osmlab.github.io/osm-deep-history/#/${osmType[type]}/${id}`
}

export const mapillaryUrl = (
  geometry: maplibregl.GeoJSONFeature['geometry']
) => {
  let [lat, lng] = [0, 0]
  switch (geometry.type) {
    case 'Point': {
      lng = geometry.coordinates[0]
      lat = geometry.coordinates[1]
      break
    }
    case 'LineString': {
      const middle =
        geometry.coordinates[Math.floor(geometry.coordinates.length / 2) || 0]
      lng = middle[0]
      lat = middle[1]
      break
    }
    default: {
      return undefined
      break
    }
  }
  return `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=15`
}
