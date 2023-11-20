import { SubcatAccidentsId, SubcatAccidentsStyleIds } from './subcat_accidents.const'
import { SubcatBarriersId, SubcatBarriersStyleIds } from './subcat_barriers.const'
import { SubcatBicycleParkingId, SubcatBicycleParkingStyleIds } from './subcat_bicycleParking'
import { SubcatBikelanesId, SubcatBikelanesStyleIds } from './subcat_bikelanes.const'
import {
  SubcatBikelanesPresenceId,
  SubcatBikelanesPresenceStyleIds,
} from './subcat_bikelanesPresence.const'
import {
  SubcatBikelanesPresenceIdLegacy,
  SubcatBikelanesPresenceStyleIdsLegacy,
} from './subcat_bikelanesPresence_legacy.const'
import {
  SubcatBikelanesSurfaceId,
  SubcatBikelanesSurfaceStyleIds,
} from './subcat_bikelanesSurface.const'
import { SubcatBoundariesId, SubcatBoundariesStyleIds } from './subcat_boundaries.const'
import { SubcatBuildingsId, SubcatBuildingsStyleIds } from './subcat_buildings.const'
import { SubcatEducationId, SubcatEducationStyleIds } from './subcat_education.const'
import { SubcatLanduseId, SubcatLanduseStyleIds } from './subcat_landuse.const'
import { SubcatLitId, SubcatLitStyleIds } from './subcat_lit.const'
import { SubcatLitIdLegacy, SubcatLitStyleIdsLegacy } from './subcat_lit_legacy.const'
import {
  SubcatMapillaryCoverageId,
  SubcatMapillaryCoverageStyleIds,
} from './subcat_mapillaryCoverage.const'
import { SubcatMaxspeedId, SubcatMaxspeedStyleIds } from './subcat_maxspeed.const'
import {
  SubcatMaxspeedIdLegacy,
  SubcatMaxspeedStyleIdsLegacy,
} from './subcat_maxspeed_legacy.const'
import { SubcatParkingId, SubcatParkingStyleIds } from './subcat_parking.const'
import { SubcatParkingAreasId, SubcatParkingAreasStyleIds } from './subcat_parkingAreas.const'
import { SubcatParkingDebugId, SubcatParkingDebugStyleIds } from './subcat_parkingDebug.const'
import { SubcatParkingPointsId, SubcatParkingPointsStyleIds } from './subcat_parkingPoints.const'
import { SubcatParkingStatsId, SubcatParkingStatsStyleIds } from './subcat_parkingStats.const'
import { SubcatPlacesId, SubcatPlacesStyleIds } from './subcat_places.const'
import { SubcatPoiId_Tarmac, SubcatPoiStyleIds_Tarmac } from './subcat_poi.const'
import {
  SubcatPublicTransportId,
  SubcatPublicTransportStyleIds,
} from './subcat_publicTransport.const'
import { SubcatRoadsId, SubcatRoadsStyleIds } from './subcat_roads.const'
import { SubcatRoadsSurfaceId, SubcatRoadsSurfaceStyleIds } from './subcat_roadsSurface.const'
import {
  SubcatRoadsSurfaceIdLegacy,
  SubcatRoadsSurfaceStyleIdsLegacy,
} from './subcat_roadsSurface_legacy.const'
import { SubcatRoadsIdLegacy, SubcatRoadsStyleIdsLegacy } from './subcat_roads_legacy.const'
import { SubcatSignsId, SubcatSignsStyleIds } from './subcat_signs.const'

import { MapDataCategory } from '../types'

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
