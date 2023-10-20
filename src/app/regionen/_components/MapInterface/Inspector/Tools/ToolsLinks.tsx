import React from 'react'
import { Link } from 'src/app/_components/links/Link'
import { buttonStyles } from 'src/app/_components/links/styles'
import { MapDataSourceInspectorEditor } from 'src/app/regionen/_components/MapInterface/mapData/types'
import { StoreFeaturesInspector } from '../../mapStateInteraction/useMapStateInteraction'
import { editorUrl } from './osmUrls/editorUrl'
import { historyUrl, longOsmType, mapillaryUrl, osmUrl } from './osmUrls/osmUrls'

type Props = {
  properties: maplibregl.GeoJSONFeature['properties']
  geometry: StoreFeaturesInspector['inspectorFeatures'][number]['geometry']
  editors?: MapDataSourceInspectorEditor[]
}

export const ToolsLinks: React.FC<Props> = ({ properties, geometry, editors }) => {
  // Normalize id + type for Parking data
  // "atlas-geo" sometimes prefixes `-{id}`
  const osmId = Math.abs(properties.osm_id || properties.way_id || properties.area_id)
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
    <section className="flex flex-wrap gap-3 pb-1 text-xs">
      {editors?.map(({ urlTemplate, name, idKey }) => {
        const id = (idKey && (properties[idKey] as number)) || osmId
        const url = editorUrl({
          urlTemplate,
          geometry,
          osmType: osmType && longOsmType[osmType],
          osmId: id,
        })
        if (!url) return null
        return (
          <Link key={name} blank href={url} classNameOverwrite={buttonStyles}>
            {name}
          </Link>
        )
      })}

      {osmUrlHref && (
        <Link blank href={osmUrlHref} classNameOverwrite={buttonStyles}>
          OpenStreetMap
        </Link>
      )}

      {historyUrlHref && (
        <Link blank href={historyUrlHref} classNameOverwrite={buttonStyles}>
          Änderungshistorie
        </Link>
      )}

      {mapillaryUrlHref && (
        <Link blank href={mapillaryUrlHref} classNameOverwrite={buttonStyles}>
          Mapillary
        </Link>
      )}
    </section>
  )
}
