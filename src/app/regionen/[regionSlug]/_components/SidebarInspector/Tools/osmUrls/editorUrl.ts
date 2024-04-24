import { MapDataSourceInspectorEditor } from 'src/app/regionen/[regionSlug]/_mapData/types'
import { pointFromGeometry } from './pointFromGeometry'
import { shortOsmType } from './osmUrls'

type Props = {
  urlTemplate: MapDataSourceInspectorEditor['urlTemplate']
  geometry: maplibregl.GeoJSONFeature['geometry']
  osmType?: string
  osmId?: number | string
  zoom?: number
}

export const editorUrl = ({ urlTemplate, geometry, osmType, osmId, zoom }: Props) => {
  const [lng, lat] = pointFromGeometry(geometry)
  if (!lng || !lat) return undefined

  return urlTemplate
    .toString()
    .replace('{zoom}', zoom?.toString() ?? '19')
    .replace('{latitude}', lat.toString())
    .replace('{longitude}', lng.toString())
    .replace('{osm_type}', osmType ? shortOsmType[osmType] : '')
    .replace('{osm_id}', osmId?.toString() ?? '')
}
