import { MapDataSourceInspectorEditor } from 'src/app/regionen/[regionSlug]/_mapData/types'
import { extractOsmTypeIdByConfig } from './extractOsmTypeIdByConfig'
import { shortOsmType } from './osmUrls'
import { pointFromGeometry } from './pointFromGeometry'

type Props = {
  urlTemplate: MapDataSourceInspectorEditor['urlTemplate']
  geometry: maplibregl.GeoJSONFeature['geometry']
  osmTypeId?: ReturnType<typeof extractOsmTypeIdByConfig>
  editorId?: MapDataSourceInspectorEditor['idKey']
  zoom?: number
}

export const editorUrl = ({ urlTemplate, geometry, osmTypeId, editorId, zoom }: Props) => {
  const [lng, lat] = pointFromGeometry(geometry)
  if (!lng || !lat) return undefined

  return urlTemplate
    .toString()
    .replace('{zoom}', zoom?.toString() ?? '19')
    .replace('{latitude}', lat.toString())
    .replace('{longitude}', lng.toString())
    .replace('{short_osm_type}', osmTypeId?.osmType ? shortOsmType[osmTypeId?.osmType] : '')
    .replace('{long_osm_type}', osmTypeId?.osmType || '')
    .replace('{editor_id}', editorId || '')
    .replace('{osm_id}', osmTypeId?.osmId?.toString() ?? '')
}
