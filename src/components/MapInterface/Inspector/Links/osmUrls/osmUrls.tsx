import { pointFromGeometry } from './pointFromGeometry'

const osmType = { W: 'way', N: 'node', R: 'relation' }

export const osmUrl = (type: 'W' | 'N' | 'R', id: number) => {
  if (!osmType[type]) return undefined
  const cleanId = Math.abs(id) // tarmag-geo sometimes prefixes "-{id}"
  return `https://www.openstreetmap.org/${osmType[type]}/${cleanId}`
}

export const historyUrl = (type: 'W' | 'N' | 'R', id: number) => {
  if (!osmType[type]) return undefined
  const cleanId = Math.abs(id) // tarmag-geo sometimes prefixes "-{id}"
  return `https://osmlab.github.io/osm-deep-history/#/${osmType[type]}/${cleanId}`
}

export const mapillaryUrl = (
  geometry: maplibregl.GeoJSONFeature['geometry']
) => {
  const [lng, lat] = pointFromGeometry(geometry)
  if (!lng || !lat) return undefined

  return `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=15`
}
