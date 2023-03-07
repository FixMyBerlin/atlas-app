import { Link } from '@components/Link'
import { MapDataSourceInspectorEditor } from '@components/MapInterface/mapData/types'
import React from 'react'
import { historyUrl, longOsmType, mapillaryUrl, osmUrl } from './osmUrls'
import { editorUrl } from './osmUrls/editorUrl'

type Props = {
  properties: maplibregl.GeoJSONFeature['properties']
  geometry: maplibregl.GeoJSONFeature['geometry']
  editors?: MapDataSourceInspectorEditor[]
}

export const Links: React.FC<Props> = ({ properties, geometry, editors }) => {
  // Normalize id + type for Parking data
  const osmId = (properties.osm_id || properties.way_id || properties.area_id)
    ?.toString()
    ?.split('.') // Parking data are split into segments with dot-notation. First part is the id.
    ?.at(0)
  const osmType: 'W' | 'N' | 'R' | undefined =
    'way_id' in properties
      ? 'W'
      : 'osm_type' in properties
      ? properties.osm_type
      : // `area_id` is what our boundaries return, they don't have osm_type field (yet)
      'area_id' in properties
      ? 'R'
      : undefined

  const osmUrl_ = osmUrl(osmType, osmId)
  const historyUrl_ = historyUrl(osmType, osmId)
  const mapillaryUrl_ = mapillaryUrl(geometry)

  if (!osmUrl_ || !historyUrl_ || !editors) return null
  return (
    <div className="bg-white px-4 pb-2.5 text-xs">
      <details className="[&_summary]:open:mb-1 [&_summary]:open:font-semibold">
        <summary className="cursor-pointer text-right">Tools</summary>
        <div className="space-y-2">
          {editors?.map(({ urlTemplate, name }) => {
            const url = editorUrl({
              urlTemplate,
              geometry,
              osmType: osmType && longOsmType[osmType],
              osmId,
            })
            if (!url) return null
            return (
              <p key={name}>
                <Link external blank to={url}>
                  {name}
                </Link>
              </p>
            )
          })}
          <p>
            <Link external blank to={osmUrl_}>
              In OpenStreetMap öffnen
            </Link>
          </p>
          <p>
            <Link external blank to={historyUrl_}>
              Änderungshistorie anzeigen
            </Link>
          </p>

          {mapillaryUrl_ && (
            <p>
              <Link external blank to={mapillaryUrl_}>
                Mapillary
              </Link>
            </p>
          )}
        </div>
      </details>
    </div>
  )
}
