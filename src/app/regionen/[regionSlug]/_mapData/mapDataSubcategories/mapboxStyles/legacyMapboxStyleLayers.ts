import { flattenFilterArrays } from '../../../_components/Map/SourcesAndLayers/utils/filterUtils/flattenFilterArrays'
import { wrapFilterWithAll } from '../../../_components/Map/SourcesAndLayers/utils/filterUtils/wrapFilterWithAll'
import { SourcesId } from '../../mapDataSources/sources.const'
import rawMapboxStylesByLayerGroup from './legacy-mapbox-layer-styles-by-group.json'

type LegacyMapboxStyleGrupIds =
  | 'atlas_barriers__area'
  | 'atlas_barriers__line'
  | 'atlas_bikelane_presence'
  | 'atlas_bikelanes'
  | 'atlas_bikelanes_unspecified'
  | 'atlas_bikelanes_verified'
  | 'atlas_boundaries'
  | 'atlas_landuse'
  | 'atlas_lit'
  | 'atlas_lit_complete'
  | 'atlas_lit_fresh'
  | 'atlas_maxspeed'
  | 'atlas_maxspeed_details'
  | 'atlas_mischverkehr'
  | 'atlas_old_bikelanespresence_complete'
  | 'atlas_old_lit'
  | 'atlas_old_lit_fresh'
  | 'atlas_maxspeed_above40'
  | 'atlas_maxspeed_all'
  | 'atlas_maxspeed_below30'
  | 'atlas_roadclassification_all'
  | 'atlas_roadclassification_plus_fusswege'
  | 'atlas_roadclassification_sidestreets'
  | 'atlas_old_roadclass_maxspeed'
  | 'atlas_old_roadclass_maxspeed_details'
  | 'atlas_old_roadclassification'
  | 'atlas_old_surface_present'
  | 'atlas_oneway'
  | 'atlas_places'
  | 'atlas_placescircle'
  | 'atlas_pois_default'
  | 'atlas_pois_education'
  | 'atlas_publictransport'
  | 'atlas_roadclassification'
  | 'atlas_surface_bad'
  | 'atlas_surface_fresh'
  | 'atlas_surface_good'
  | 'atlas_surface_present'
  | 'parking_areas'
  | 'parking_calculator'
  | 'parking_debug_bus_tram'
  | 'parking_debug_crossings'
  | 'parking_debug_driveways'
  | 'parking_debug_kerb'
  | 'parking_debug_parking_points'
  | 'parking_debug_parking_poly'
  | 'parking_debug_ramps'
  | 'parking_obstacles'
  | 'parking_parkinglines'
  | 'parking_parkinglines_completeness'
  | 'parking_parkinglines_labels'
  | 'parking_parkinglines_surface'
  | 'parking_stats'
  | 'parking_stats_length'

type StylesByLayerGroup = { group: LegacyMapboxStyleGrupIds; layers: any }[]
export const mapboxStylesByLayerGroup = rawMapboxStylesByLayerGroup as StylesByLayerGroup

export type Props = {
  group: LegacyMapboxStyleGrupIds
  source: SourcesId
  sourceLayer: string
  idPrefix?: string
  additionalFilter?: ['match', ['get', string], string[], boolean, boolean]
}

// TODO: This file is based on the mapbox-layer-styles-by-group.json which we are fading out.
export const legacyMapboxStyleLayers = ({
  group,
  source,
  sourceLayer,
  idPrefix,
  additionalFilter,
}: Props) => {
  const mapboxLayers = mapboxStylesByLayerGroup.find((g: any) => g.group === group)?.layers
  const mapboxLayersClone = structuredClone(mapboxLayers)

  if (!mapboxLayersClone) {
    console.error(
      'Error in `mapboxStyleLayers()`: Cannot find groupName in `mapboxStylesByLayerGroup`',
      {
        group,
        source,
        sourceLayer,
        mapboxStylesByLayerGroup,
      },
    )
    return undefined
  }

  // Add required source id data that is not part of what we receive from the mapbox styles API
  mapboxLayersClone.forEach((layer: any) => {
    layer['source'] = source
    layer['source-layer'] = sourceLayer
    layer.id = [idPrefix, layer.id].filter(Boolean).join('--')
    layer.filter = additionalFilter
      ? wrapFilterWithAll(flattenFilterArrays(layer.filter, additionalFilter))
      : layer.filter
  })

  return mapboxLayersClone
}
