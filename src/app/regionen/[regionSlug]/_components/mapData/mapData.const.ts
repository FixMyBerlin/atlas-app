import { categories } from './mapDataCategories/categories.const'
import { sources } from './mapDataSources/sources.const'
import {
  SubcatAccidentsId,
  SubcatAccidentsStyleIds,
  subcat_accidents,
} from './mapDataSubcategories/subcat_accidents.const'
import {
  SubcatBarriersId,
  SubcatBarriersStyleIds,
  subcat_barriers,
} from './mapDataSubcategories/subcat_barriers.const'
import {
  SubcatBicycleParkingId,
  SubcatBicycleParkingStyleIds,
  subcat_bicycleParking,
} from './mapDataSubcategories/subcat_bicycleParking'
import {
  SubcatBikelanesId,
  SubcatBikelanesStyleIds,
  subcat_bikelanes,
} from './mapDataSubcategories/subcat_bikelanes.const'
import {
  SubcatBikelanesPresenceId,
  SubcatBikelanesPresenceStyleIds,
  subcat_bikelanesPresence,
} from './mapDataSubcategories/subcat_bikelanesPresence.const'
import {
  SubcatBikelanesPresenceIdLegacy,
  SubcatBikelanesPresenceStyleIdsLegacy,
  subcat_bikelanesPresence_legacy,
} from './mapDataSubcategories/subcat_bikelanesPresence_legacy.const'
import {
  SubcatBikelanesSurfaceId,
  SubcatBikelanesSurfaceStyleIds,
  subcat_bikelanesSurface,
} from './mapDataSubcategories/subcat_bikelanesSurface.const'
import {
  SubcatBoundariesId,
  SubcatBoundariesStyleIds,
  subcat_boundaries,
} from './mapDataSubcategories/subcat_boundaries.const'
import {
  SubcatBuildingsId,
  SubcatBuildingsStyleIds,
  subcat_buildings,
} from './mapDataSubcategories/subcat_buildings.const'
import {
  SubcatEducationId,
  SubcatEducationStyleIds,
  subcat_education,
} from './mapDataSubcategories/subcat_education.const'
import {
  SubcatLanduseId,
  SubcatLanduseStyleIds,
  subcat_landuse,
} from './mapDataSubcategories/subcat_landuse.const'
import { SubcatLitId, SubcatLitStyleIds, subcat_lit } from './mapDataSubcategories/subcat_lit.const'
import {
  SubcatLitIdLegacy,
  SubcatLitStyleIdsLegacy,
  subcat_lit_legacy,
} from './mapDataSubcategories/subcat_lit_legacy.const'
import {
  SubcatMapillaryCoverageId,
  SubcatMapillaryCoverageStyleIds,
  subcat_mapillaryCoverage,
} from './mapDataSubcategories/subcat_mapillaryCoverage.const'
import {
  SubcatMaxspeedId,
  SubcatMaxspeedStyleIds,
  subcat_maxspeed,
} from './mapDataSubcategories/subcat_maxspeed.const'
import {
  SubcatMaxspeedIdLegacy,
  SubcatMaxspeedStyleIdsLegacy,
  subcat_maxspeed_legacy,
} from './mapDataSubcategories/subcat_maxspeed_legacy.const'
import {
  SubcatParkingId,
  SubcatParkingStyleIds,
  subcat_parking,
} from './mapDataSubcategories/subcat_parking.const'
import {
  SubcatParkingAreasId,
  SubcatParkingAreasStyleIds,
  subcat_parkingAreas,
} from './mapDataSubcategories/subcat_parkingAreas.const'
import {
  SubcatParkingDebugId,
  SubcatParkingDebugStyleIds,
  subcat_parkingDebug,
} from './mapDataSubcategories/subcat_parkingDebug.const'
import {
  SubcatParkingPointsId,
  SubcatParkingPointsStyleIds,
  subcat_parkingPoints,
} from './mapDataSubcategories/subcat_parkingPoints.const'
import {
  SubcatParkingStatsId,
  SubcatParkingStatsStyleIds,
  subcat_parkingStats,
} from './mapDataSubcategories/subcat_parkingStats.const'
import {
  SubcatPlacesId,
  SubcatPlacesStyleIds,
  subcat_places,
} from './mapDataSubcategories/subcat_places.const'
import {
  SubcatPoiId_Tarmac,
  SubcatPoiStyleIds_Tarmac,
  subcat_poi,
} from './mapDataSubcategories/subcat_poi.const'
import {
  SubcatPublicTransportId,
  SubcatPublicTransportStyleIds,
  subcat_publicTransport,
} from './mapDataSubcategories/subcat_publicTransport.const'
import {
  SubcatRoadsId,
  SubcatRoadsStyleIds,
  subcat_roads,
} from './mapDataSubcategories/subcat_roads.const'
import {
  SubcatRoadsSurfaceId,
  SubcatRoadsSurfaceStyleIds,
  subcat_roadsSurface,
} from './mapDataSubcategories/subcat_roadsSurface.const'
import {
  SubcatRoadsSurfaceIdLegacy,
  SubcatRoadsSurfaceStyleIdsLegacy,
  subcat_roadsSurface_legacy,
} from './mapDataSubcategories/subcat_roadsSurface_legacy.const'
import {
  SubcatRoadsIdLegacy,
  SubcatRoadsStyleIdsLegacy,
  subcat_roads_legacy,
} from './mapDataSubcategories/subcat_roads_legacy.const'
import {
  SubcatSignsId,
  SubcatSignsStyleIds,
  subcat_signs,
} from './mapDataSubcategories/subcat_signs.const'
import { MapData, MapDataCategory } from './types'

export type SubcategoryIds =
  | SubcatAccidentsId
  | SubcatBarriersId
  | SubcatBicycleParkingId
  | SubcatBikelanesId
  | SubcatBikelanesPresenceId
  | SubcatBikelanesPresenceIdLegacy
  | SubcatBikelanesSurfaceId
  | SubcatBoundariesId
  | SubcatBuildingsId
  | SubcatEducationId
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
  | SubcatRoadsSurfaceId
  | SubcatRoadsSurfaceIdLegacy
  | SubcatSignsId

type SubcatStyleIdDefaults = MapDataCategory['subcategories'][number]['defaultStyle']

export type SubcategoryStyleIds =
  | SubcatAccidentsStyleIds
  | SubcatBarriersStyleIds
  | SubcatBicycleParkingStyleIds
  | SubcatBikelanesPresenceStyleIds
  | SubcatBikelanesPresenceStyleIdsLegacy
  | SubcatBikelanesStyleIds
  | SubcatBikelanesSurfaceStyleIds
  | SubcatBoundariesStyleIds
  | SubcatBuildingsStyleIds
  | SubcatEducationStyleIds
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
  | SubcatRoadsStyleIds
  | SubcatRoadsStyleIdsLegacy
  | SubcatRoadsSurfaceStyleIds
  | SubcatRoadsSurfaceStyleIdsLegacy
  | SubcatSignsStyleIds
  | SubcatStyleIdDefaults

export type SubcatStyleLegendIds = string // TODO: We can make this more precise later

export const mapData: MapData = {
  sources,
  categories,
  subcategories: [
    subcat_accidents,
    subcat_barriers,
    subcat_bicycleParking,
    subcat_bikelanes,
    subcat_bikelanesPresence_legacy,
    subcat_bikelanesPresence,
    subcat_bikelanesSurface,
    subcat_boundaries,
    subcat_buildings,
    subcat_education,
    subcat_landuse,
    subcat_lit_legacy,
    subcat_lit,
    subcat_mapillaryCoverage,
    subcat_maxspeed_legacy,
    subcat_maxspeed,
    subcat_parking,
    subcat_parkingAreas,
    subcat_parkingDebug,
    subcat_parkingPoints,
    subcat_parkingStats,
    subcat_places,
    subcat_poi,
    subcat_publicTransport,
    subcat_roads_legacy,
    subcat_roads,
    subcat_roadsSurface_legacy,
    subcat_roadsSurface,
    subcat_signs,
  ],
}
