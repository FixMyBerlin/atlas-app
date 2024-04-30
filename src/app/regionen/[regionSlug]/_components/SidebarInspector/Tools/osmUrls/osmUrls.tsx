import { editorUrl } from './editorUrl'
import { extractOsmTypeIdByConfig } from './extractOsmTypeIdByConfig'
import { longOsmType, shortOsmType } from './shortLongOsmType'
import { pointFromGeometry } from './pointFromGeometry'

type OsmTypeId = ReturnType<typeof extractOsmTypeIdByConfig>

export const osmTypeIdString = (type: string, id: string | number) => {
  return `${longOsmType[type]}/${id}`
}

export const osmUrl = ({ osmType, osmId }: OsmTypeId) => {
  if (!osmType || !osmId) return undefined

  return `https://www.openstreetmap.org/${osmType}/${osmId}`
}

export const osmEditIdUrl = ({ osmType, osmId }: OsmTypeId) => {
  if (!osmType || !osmId) return undefined

  // return `https://www.openstreetmap.org/edit?${osmType}=${id}`
  return `https://pr-1137--ideditor-presets-preview.netlify.app/id/dist/#id=${shortOsmType[osmType]}${osmId}&background=Brandenburg-DOP20c&disable_features=boundaries&locale=de&hashtags=radverkehrsatlas`
}

export const osmEditRapidUrl = ({ osmType, osmId }: OsmTypeId) => {
  if (!osmType || !osmId) return undefined

  return `https://rapideditor.org/edit#id=${shortOsmType[osmType]}${osmId}&disable_features=boundaries&locale=de&hashtags=radverkehrsatlas`
}

export const historyUrl = ({ osmType, osmId }: OsmTypeId) => {
  if (!osmType || !osmId) return undefined

  return `https://osmlab.github.io/osm-deep-history/#/${osmType}/${osmId}`
}

export const mapillaryUrl = (
  geometry: maplibregl.GeoJSONFeature['geometry'],
  yearsAgo?: number,
) => {
  const [lng, lat] = pointFromGeometry(geometry)
  if (!lng || !lat) return undefined

  const url = new URL('https://www.mapillary.com/app/')
  url.searchParams.set('lat', lat.toString())
  url.searchParams.set('lng', lng.toString())
  url.searchParams.set('z', '15')
  if (yearsAgo) {
    url.searchParams.set(
      'dateFrom',
      new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().slice(0, 10),
    )
  }

  return url.toString()
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
