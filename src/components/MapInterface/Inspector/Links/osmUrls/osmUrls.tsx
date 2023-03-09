import { pointFromGeometry } from './pointFromGeometry'

export type OsmShortType = 'W' | 'N' | 'R' | undefined
export const longOsmType = { W: 'way', N: 'node', R: 'relation' }

export const osmUrl = (type: OsmShortType, id: number) => {
  if (!type || (type && !longOsmType[type])) return undefined

  const cleanId = Math.abs(id) // tarmag-geo sometimes prefixes "-{id}"
  return `https://www.openstreetmap.org/${longOsmType[type]}/${cleanId}`
}

export const historyUrl = (type: OsmShortType, id: number) => {
  if (!type || (type && !longOsmType[type])) return undefined

  const cleanId = Math.abs(id) // tarmag-geo sometimes prefixes "-{id}"
  return `https://osmlab.github.io/osm-deep-history/#/${longOsmType[type]}/${cleanId}`
}

export const mapillaryUrl = (
  geometry: maplibregl.GeoJSONFeature['geometry']
) => {
  const [lng, lat] = pointFromGeometry(geometry)
  if (!lng || !lat) return undefined

  return `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=15`
}
