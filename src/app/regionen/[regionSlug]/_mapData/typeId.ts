import {
  SubcatAccidentsId,
  SubcatAccidentsStyleIds,
} from './mapDataSubcategories/subcat_accidents.const'
import {
  SubcatBarriersId,
  SubcatBarriersStyleIds,
} from './mapDataSubcategories/subcat_barriers.const'
import {
  SubcatBicycleParkingId,
  SubcatBicycleParkingStyleIds,
} from './mapDataSubcategories/subcat_bicycleParking'
import {
  SubcatBikelanesId,
  SubcatBikelanesStyleIds,
} from './mapDataSubcategories/subcat_bikelanes.const'
import {
  SubcatBikelanesPresenceId,
  SubcatBikelanesPresenceStyleIds,
} from './mapDataSubcategories/subcat_bikelanesPresence.const'
import {
  SubcatBikelanesPresenceIdLegacy,
  SubcatBikelanesPresenceStyleIdsLegacy,
} from './mapDataSubcategories/subcat_bikelanesPresence_legacy.const'
import {
  SubcatBikelanesStatsId,
  SubcatBikelanesStatsStyleIds,
} from './mapDataSubcategories/subcat_bikelanesStatistics.const'
import {
  SubcatBikelanesPlusSignsId,
  SubcatBikelanesPlusSignsStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_signs.const'
import {
  SubcatBikelanesPlusSurfaceId,
  SubcatBikelanesPlusSurfaceStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_surface_text.const'
import {
  SubcatBikelanesPlusWidthId,
  SubcatBikelanesPlusWidthStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_width.const'
import {
  SubcatBoundariesId,
  SubcatBoundariesStyleIds,
} from './mapDataSubcategories/subcat_boundaries.const'
import { SubcatLanduseId, SubcatLanduseStyleIds } from './mapDataSubcategories/subcat_landuse.const'
import { SubcatLitId, SubcatLitStyleIds } from './mapDataSubcategories/subcat_lit.const'
import {
  SubcatLitIdLegacy,
  SubcatLitStyleIdsLegacy,
} from './mapDataSubcategories/subcat_lit_legacy.const'
import {
  SubcatMapillaryCoverageId,
  SubcatMapillaryCoverageStyleIds,
} from './mapDataSubcategories/subcat_mapillaryCoverage.const'
import {
  SubcatMaxspeedId,
  SubcatMaxspeedStyleIds,
} from './mapDataSubcategories/subcat_maxspeed.const'
import {
  SubcatMaxspeedIdLegacy,
  SubcatMaxspeedStyleIdsLegacy,
} from './mapDataSubcategories/subcat_maxspeed_legacy.const'
import { SubcatParkingId, SubcatParkingStyleIds } from './mapDataSubcategories/subcat_parking.const'
import {
  SubcatParkingAreasId,
  SubcatParkingAreasStyleIds,
} from './mapDataSubcategories/subcat_parkingAreas.const'
import {
  SubcatParkingDebugId,
  SubcatParkingDebugStyleIds,
} from './mapDataSubcategories/subcat_parkingDebug.const'
import {
  SubcatParkingPointsId,
  SubcatParkingPointsStyleIds,
} from './mapDataSubcategories/subcat_parkingPoints.const'
import {
  SubcatParkingStatsId,
  SubcatParkingStatsStyleIds,
} from './mapDataSubcategories/subcat_parkingStats.const'
import { SubcatPlacesId, SubcatPlacesStyleIds } from './mapDataSubcategories/subcat_places.const'
import {
  SubcatPoiId_Tarmac,
  SubcatPoiStyleIds_Tarmac,
} from './mapDataSubcategories/subcat_poi.const'
import {
  SubcatPublicTransportId,
  SubcatPublicTransportStyleIds,
} from './mapDataSubcategories/subcat_publicTransport.const'
import { SubcatRoadsId, SubcatRoadsStyleIds } from './mapDataSubcategories/subcat_roads.const'
import {
  SubcatRoadsSurfaceIdLegacy,
  SubcatRoadsSurfaceStyleIdsLegacy,
} from './mapDataSubcategories/subcat_roadsSurface_legacy.const'
import {
  SubcatRoadsIdLegacy,
  SubcatRoadsStyleIdsLegacy,
} from './mapDataSubcategories/subcat_roads_legacy.const'
import {
  SubcatRoadsPlusFootwaysId,
  SubcatRoadsPlusFootwaysStyleIds,
} from './mapDataSubcategories/subcat_roads_plus_footways.const'
import { SubcatSignsId, SubcatSignsStyleIds } from './mapDataSubcategories/subcat_signs.const'
import {
  SubcatSurfaceBikelaneId,
  SubcatSurfaceBikelaneStyleIds,
} from './mapDataSubcategories/subcat_surface_bikelane'
import {
  SubcatSurfaceRoadsId,
  SubcatSurfaceRoadsStyleIds,
} from './mapDataSubcategories/subcat_surface_roads.const'
import { StaticMapDataCategory } from './types'

export type SubcategoryId =
  | SubcatAccidentsId
  | SubcatBarriersId
  | SubcatBicycleParkingId
  | SubcatBikelanesId
  | SubcatBikelanesPlusSignsId
  | SubcatBikelanesPlusSurfaceId
  | SubcatBikelanesPlusWidthId
  | SubcatBikelanesPresenceId
  | SubcatBikelanesPresenceIdLegacy
  | SubcatBikelanesStatsId
  | SubcatBoundariesId
  | SubcatLanduseId
  | SubcatLitId
  | SubcatLitIdLegacy
  | SubcatMapillaryCoverageId
  | SubcatMaxspeedId
  | SubcatMaxspeedIdLegacy
  | SubcatParkingAreasId
  | SubcatParkingDebugId
  | SubcatParkingId
  | SubcatParkingPointsId
  | SubcatParkingStatsId
  | SubcatPlacesId
  | SubcatPoiId_Tarmac
  | SubcatPublicTransportId
  | SubcatRoadsId
  | SubcatRoadsIdLegacy
  | SubcatRoadsPlusFootwaysId
  | SubcatRoadsSurfaceIdLegacy
  | SubcatSignsId
  | SubcatSurfaceBikelaneId
  | SubcatSurfaceRoadsId

type StyleIdDefaults = StaticMapDataCategory['subcategories'][number]['defaultStyle']

export type StyleId =
  | StyleIdDefaults
  | SubcatAccidentsStyleIds
  | SubcatBarriersStyleIds
  | SubcatBicycleParkingStyleIds
  | SubcatBikelanesPlusSignsStyleIds
  | SubcatBikelanesPlusSurfaceStyleIds
  | SubcatBikelanesPlusWidthStyleIds
  | SubcatBikelanesPresenceStyleIds
  | SubcatBikelanesPresenceStyleIdsLegacy
  | SubcatBikelanesStatsStyleIds
  | SubcatBikelanesStyleIds
  | SubcatBoundariesStyleIds
  | SubcatLanduseStyleIds
  | SubcatLitStyleIds
  | SubcatLitStyleIdsLegacy
  | SubcatMapillaryCoverageStyleIds
  | SubcatMaxspeedStyleIds
  | SubcatMaxspeedStyleIdsLegacy
  | SubcatParkingAreasStyleIds
  | SubcatParkingDebugStyleIds
  | SubcatParkingPointsStyleIds
  | SubcatParkingStatsStyleIds
  | SubcatParkingStyleIds
  | SubcatPlacesStyleIds
  | SubcatPoiStyleIds_Tarmac
  | SubcatPublicTransportStyleIds
  | SubcatRoadsPlusFootwaysStyleIds
  | SubcatRoadsStyleIds
  | SubcatRoadsStyleIdsLegacy
  | SubcatRoadsSurfaceStyleIdsLegacy
  | SubcatSignsStyleIds
  | SubcatSurfaceBikelaneStyleIds
  | SubcatSurfaceRoadsStyleIds

export type LegendId = string // TODO: We can make this more precise later
