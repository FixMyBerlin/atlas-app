import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { isProd } from 'src/app/_components/utils/isEnv'
import { MapDataSourceInspectorEditor } from 'src/app/regionen/[regionSlug]/_mapData/types'
import { StoreFeaturesInspector } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { editorUrl } from './osmUrls/editorUrl'
import {
  type OsmShortOrLongType,
  historyUrl,
  longOsmType,
  mapillaryUrl,
  osmEditIdUrl,
  osmEditRapidUrl,
  osmUrl,
} from './osmUrls/osmUrls'

type Props = {
  properties: maplibregl.GeoJSONFeature['properties']
  geometry: StoreFeaturesInspector['unfilteredInspectorFeatures'][number]['geometry']
  editors?: MapDataSourceInspectorEditor[]
}

export const ToolsLinks = ({ properties, geometry, editors }: Props) => {
  // Normalize id + type for Parking data
  // "atlas-geo" sometimes prefixes `-{id}`
  const osmIdFromId = properties?.id?.split('/')?.[1]
  const osmTypeFromId = properties?.id?.split('/')?.[0]
  const osmId =
    osmIdFromId || Math.abs(properties.osm_id || properties.way_id || properties.area_id)
  const osmType: OsmShortOrLongType =
    osmTypeFromId ||
    ('way_id' in properties
      ? 'W'
      : 'osm_type' in properties
        ? properties.osm_type
        : // `area_id` is what boundaries return, they don't have osm_type field (yet)
          'area_id' in properties
          ? 'R'
          : undefined)

  const osmUrlHref = osmUrl(osmType, osmId)
  const osmEditIdUrlHref = osmEditIdUrl(osmType, osmId)
  const osmEditRapidUrlHref = osmEditRapidUrl(osmType, osmId)
  const historyUrlHref = historyUrl(osmType, osmId)
  const mapillaryUrlHref = mapillaryUrl(geometry)

  // Type Guard
  if (!osmUrlHref && !osmEditRapidUrlHref && !osmEditRapidUrlHref && !historyUrlHref && !editors) {
    return null
  }

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
          <LinkExternal key={name} blank button href={url}>
            {name}
          </LinkExternal>
        )
      })}

      {osmUrlHref && (
        <LinkExternal blank button href={osmUrlHref}>
          OpenStreetMap
        </LinkExternal>
      )}

      {osmEditIdUrlHref && (
        <LinkExternal blank button href={osmEditIdUrlHref}>
          Bearbeiten (iD)
        </LinkExternal>
      )}

      {/* Just for testing for now… */}
      {!isProd && osmEditRapidUrlHref && (
        <LinkExternal blank button href={osmEditRapidUrlHref}>
          Bearbeiten (Rapid) (Staging only)
        </LinkExternal>
      )}

      {historyUrlHref && (
        <LinkExternal blank button href={historyUrlHref}>
          Änderungshistorie
        </LinkExternal>
      )}

      {mapillaryUrlHref && (
        <LinkExternal blank button href={mapillaryUrlHref}>
          Mapillary
        </LinkExternal>
      )}
    </section>
  )
}
