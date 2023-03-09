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

  if (!osmUrl_ && !historyUrl_ && !editors) return null
  return (
    <div className="flex gap-4 border-t bg-white px-4 py-2.5 text-xs">
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
            <Link external blank to={url} classNameOverwrite={buttonStyles}>
              {name}
            </Link>
          </p>
        )
      })}
      {osmUrl_ && (
        <p>
          <Link external blank to={osmUrl_} classNameOverwrite={buttonStyles}>
            OpenStreetMap
          </Link>
        </p>
      )}
      {historyUrl_ && (
        <p>
          <Link
            external
            blank
            to={historyUrl_}
            classNameOverwrite={buttonStyles}
          >
            Änderungshistorie
          </Link>
        </p>
      )}

      {mapillaryUrl_ && (
        <p>
          <Link
            external
            blank
            to={mapillaryUrl_}
            classNameOverwrite={buttonStyles}
          >
            Mapillary
          </Link>
        </p>
      )}
    </div>
  )
}
