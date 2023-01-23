import { Link } from '@components/Link'
import React from 'react'
import { historyUrl, mapillaryUrl, osmUrl } from './osmUrls'

type Props = {
  properties: maplibregl.GeoJSONFeature['properties']
  geometry: maplibregl.GeoJSONFeature['geometry']
}

export const Links: React.FC<Props> = ({ properties, geometry }) => {
  // Normalize id + type for Parking data
  const osmId = properties.osm_id || properties.way_id
  const osmType = 'osm_type' in properties ? properties.osm_type : 'W'

  const osmUrl_ = osmUrl(osmType, osmId)
  const historyUrl_ = historyUrl(osmType, osmId)
  const mapillaryUrl_ = mapillaryUrl(geometry)

  if (!osmUrl_ || !historyUrl_) return null
  return (
    <div className="bg-white px-4 pb-2.5 text-xs">
      <details className="[&_summary]:open:mb-1 [&_summary]:open:font-semibold">
        <summary className="cursor-pointer text-right">Tools</summary>
        <div className="space-y-2">
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
