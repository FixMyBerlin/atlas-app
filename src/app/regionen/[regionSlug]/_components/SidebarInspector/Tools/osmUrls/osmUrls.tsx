import { editorUrl } from './editorUrl'
import { pointFromGeometry } from './pointFromGeometry'

export type OsmShortType = 'W' | 'N' | 'R' | undefined
export const longOsmType = { W: 'way', N: 'node', R: 'relation' }

export const osmUrl = (type: OsmShortType, id: number | string) => {
  if (!type || (type && !longOsmType[type])) return undefined

  return `https://www.openstreetmap.org/${longOsmType[type]}/${id}`
}

export const historyUrl = (type: OsmShortType, id: number | string) => {
  if (!type || (type && !longOsmType[type])) return undefined

  return `https://osmlab.github.io/osm-deep-history/#/${longOsmType[type]}/${id}`
}

export const mapillaryUrl = (geometry: maplibregl.GeoJSONFeature['geometry']) => {
  const [lng, lat] = pointFromGeometry(geometry)
  if (!lng || !lat) return undefined

  return `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=15`
}

export const mapillaryKeyUrl = (key: number) => {
  if (!key) return undefined

  return `https://www.mapillary.com/app/?pKey=${key}&focus=photo&z=15`
}

export const osmUrlViewport = (zoom?: number, lat?: number, lng?: number) => {
  if (!zoom || !lat || !lng) return

  const urlTemplate = 'https://www.openstreetmap.org/#map={zoom}/{latitude}/{longitude}&layers=N'
  const geometry = {
    type: 'Point',
    coordinates: [lng, lat],
  } satisfies maplibregl.GeoJSONFeature['geometry']

  return editorUrl({
    urlTemplate,
    geometry,
    zoom,
  })
}

export const mapillaryUrlViewport = (zoom?: number, lat?: number, lng?: number) => {
  if (!zoom || !lat || !lng) return

  const urlTemplate = 'https://www.mapillary.com/app?z={zoom}&lat={latitude}&lng={longitude}'
  const geometry = {
    type: 'Point',
    coordinates: [lng, lat],
  } satisfies maplibregl.GeoJSONFeature['geometry']

  return editorUrl({
    urlTemplate,
    geometry,
    zoom,
  })
}

export const googleMapsUrlViewport = (zoom?: number, lat?: number, lng?: number) => {
  if (!zoom || !lat || !lng) return

  const urlTemplate = 'https://www.google.de/maps/@{latitude},{longitude},{zoom}z/data=!5m1!1e4'
  const geometry = {
    type: 'Point',
    coordinates: [lng, lat],
  } satisfies maplibregl.GeoJSONFeature['geometry']

  return editorUrl({
    urlTemplate,
    geometry,
    zoom,
  })
}
