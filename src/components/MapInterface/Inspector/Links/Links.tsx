import { buttonStyles, Link } from '@components/Link'
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
  // "atlas-geo" sometimes prefixes `-{id}`
  const osmId = Math.abs(
    properties.osm_id || properties.way_id || properties.area_id
  )
  const osmType: 'W' | 'N' | 'R' | undefined =
    'way_id' in properties
      ? 'W'
      : 'osm_type' in properties
      ? properties.osm_type
      : // `area_id` is what   boundaries return, they don't have osm_type field (yet)
      'area_id' in properties
      ? 'R'
      : undefined

  const osmUrlHref = osmUrl(osmType, osmId)
  const historyUrlHref = historyUrl(osmType, osmId)
  const mapillaryUrlHref = mapillaryUrl(geometry)

  if (!osmUrlHref && !historyUrlHref && !editors) return null
  return (
    <div className="flex flex-wrap gap-3 border-t bg-white px-4 py-2.5 text-xs">
      {editors?.map(({ urlTemplate, name }) => {
        const url = editorUrl({
          urlTemplate,
          geometry,
          osmType: osmType && longOsmType[osmType],
          osmId,
        })
        if (!url) return null
        return (
          <Link
            key={name}
            external
            blank
            to={url}
            classNameOverwrite={buttonStyles}
          >
            {name}
          </Link>
        )
      })}

      {osmUrlHref && (
        <Link external blank to={osmUrlHref} classNameOverwrite={buttonStyles}>
          OpenStreetMap
        </Link>
      )}

      {historyUrlHref && (
        <Link
          external
          blank
          to={historyUrlHref}
          classNameOverwrite={buttonStyles}
        >
          Änderungshistorie
        </Link>
      )}

      {mapillaryUrlHref && (
        <Link
          external
          blank
          to={mapillaryUrlHref}
          classNameOverwrite={buttonStyles}
        >
          Mapillary
        </Link>
      )}
    </div>
  )
}
