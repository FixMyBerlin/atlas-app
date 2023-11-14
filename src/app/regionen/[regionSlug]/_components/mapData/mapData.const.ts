import { sources } from './sourcesMapData/sources.const'
import { themes } from './themesMapData/themes.const'
import {
  TopicAccidentsId,
  TopicAccidentsStyleIds,
  topic_accidents,
} from './topicsMapData/topic_accidents.const'
import {
  TopicBarriersId,
  TopicBarriersStyleIds,
  topic_barriers,
} from './topicsMapData/topic_barriers.const'
import {
  TopicBicycleParkingId,
  TopicBicycleParkingStyleIds,
  topic_bicycleParking,
} from './topicsMapData/topic_bicycleParking'
import {
  TopicBikelanesId,
  TopicBikelanesStyleIds,
  topic_bikelanes,
} from './topicsMapData/topic_bikelanes.const'
import {
  TopicBikelanesPresenceId,
  TopicBikelanesPresenceStyleIds,
  topic_bikelanesPresence,
} from './topicsMapData/topic_bikelanesPresence.const'
import {
  TopicBikelanesPresenceIdLegacy,
  TopicBikelanesPresenceStyleIdsLegacy,
  topic_bikelanesPresence_legacy,
} from './topicsMapData/topic_bikelanesPresence_legacy.const'
import {
  TopicBoundariesId,
  TopicBoundariesStyleIds,
  topic_boundaries,
} from './topicsMapData/topic_boundaries.const'
import {
  TopicBuildingsId,
  TopicBuildingsStyleIds,
  topic_buildings,
} from './topicsMapData/topic_buildings.const'
import {
  TopicEducationId,
  TopicEducationStyleIds,
  topic_education,
} from './topicsMapData/topic_education.const'
import {
  TopicLanduseId,
  TopicLanduseStyleIds,
  topic_landuse,
} from './topicsMapData/topic_landuse.const'
import { TopicLitId, TopicLitStyleIds, topic_lit } from './topicsMapData/topic_lit.const'
import {
  TopicLitIdLegacy,
  TopicLitStyleIdsLegacy,
  topic_lit_legacy,
} from './topicsMapData/topic_lit_legacy.const'
import {
  TopicMapillaryCoverageId,
  TopicMapillaryCoverageStyleIds,
  topic_mapillaryCoverage,
} from './topicsMapData/topic_mapillaryCoverage.const'
import {
  TopicMaxspeedId,
  TopicMaxspeedStyleIds,
  topic_maxspeed,
} from './topicsMapData/topic_maxspeed.const'
import {
  TopicMaxspeedIdLegacy,
  TopicMaxspeedStyleIdsLegacy,
  topic_maxspeed_legacy,
} from './topicsMapData/topic_maxspeed_legacy.const'
import {
  TopicParkingId,
  TopicParkingStyleIds,
  topic_parking,
} from './topicsMapData/topic_parking.const'
import {
  TopicParkingAreasId,
  TopicParkingAreasStyleIds,
  topic_parkingAreas,
} from './topicsMapData/topic_parkingAreas.const'
import {
  TopicParkingDebugId,
  TopicParkingDebugStyleIds,
  topic_parkingDebug,
} from './topicsMapData/topic_parkingDebug.const'
import {
  TopicParkingPointsId,
  TopicParkingPointsStyleIds,
  topic_parkingPoints,
} from './topicsMapData/topic_parkingPoints.const'
import {
  TopicParkingStatsId,
  TopicParkingStatsStyleIds,
  topic_parkingStats,
} from './topicsMapData/topic_parkingStats.const'
import {
  TopicPlacesId,
  TopicPlacesStyleIds,
  topic_places,
} from './topicsMapData/topic_places.const'
import {
  TopicPoiClassificationId_Tarmac,
  TopicPoiClassificationStyleIds_Tarmac,
  topic_poiClassification_tarmac,
} from './topicsMapData/topic_poiClassification.const'
import {
  TopicPublicTransportId,
  TopicPublicTransportStyleIds,
  topic_publicTransport,
} from './topicsMapData/topic_publicTransport.const'
import {
  TopicRoadClassificationId,
  TopicRoadClassificationStyleIds,
  topic_roadClassification,
} from './topicsMapData/topic_roadClassification.const'
import {
  TopicRoadClassificationIdLegacy,
  TopicRoadClassificationStyleIdsLegacy,
  topic_roadClassification_legacy,
} from './topicsMapData/topic_roadClassification_legacy.const'
import {
  TopicSurfaceQualityId,
  TopicSurfaceStyleQualityIds,
  topic_surfaceQuality,
} from './topicsMapData/topic_surfaceQuality.const'
import {
  TopicSurfaceQualityIdLegacy,
  TopicSurfaceStyleQualityIdsLegacy,
  topic_surfaceQuality_legacy,
} from './topicsMapData/topic_surfaceQuality_legacy.const'
import { MapData, MapDataTheme } from './types'

export type TopicIds =
  | TopicAccidentsId
  | TopicBarriersId
  | TopicBicycleParkingId
  | TopicBikelanesId
  | TopicBikelanesPresenceId
  | TopicBikelanesPresenceIdLegacy
  | TopicBoundariesId
  | TopicBuildingsId
  | TopicEducationId
  | TopicLanduseId
  | TopicLitId
  | TopicLitIdLegacy
  | TopicMapillaryCoverageId
  | TopicMaxspeedId
  | TopicMaxspeedIdLegacy
  | TopicParkingAreasId
  | TopicParkingDebugId
  | TopicParkingId
  | TopicParkingPointsId
  | TopicParkingStatsId
  | TopicPlacesId
  | TopicPoiClassificationId_Tarmac
  | TopicPublicTransportId
  | TopicRoadClassificationId
  | TopicRoadClassificationIdLegacy
  | TopicSurfaceQualityId
  | TopicSurfaceQualityIdLegacy

type TopicStyleIdDefaults = MapDataTheme['topics'][number]['defaultStyle']

export type TopicStyleIds =
  | TopicAccidentsStyleIds
  | TopicBarriersStyleIds
  | TopicBicycleParkingStyleIds
  | TopicBikelanesPresenceStyleIds
  | TopicBikelanesPresenceStyleIdsLegacy
  | TopicBikelanesStyleIds
  | TopicBoundariesStyleIds
  | TopicBuildingsStyleIds
  | TopicEducationStyleIds
  | TopicLanduseStyleIds
  | TopicLitStyleIds
  | TopicLitStyleIdsLegacy
  | TopicMapillaryCoverageStyleIds
  | TopicMaxspeedStyleIds
  | TopicMaxspeedStyleIdsLegacy
  | TopicParkingAreasStyleIds
  | TopicParkingDebugStyleIds
  | TopicParkingPointsStyleIds
  | TopicParkingStatsStyleIds
  | TopicParkingStyleIds
  | TopicPlacesStyleIds
  | TopicPoiClassificationStyleIds_Tarmac
  | TopicPublicTransportStyleIds
  | TopicRoadClassificationStyleIds
  | TopicRoadClassificationStyleIdsLegacy
  | TopicStyleIdDefaults
  | TopicSurfaceStyleQualityIds
  | TopicSurfaceStyleQualityIdsLegacy

export type TopicStyleLegendIds = string // TODO: We can make this more precise later

export const mapData: MapData = {
  sources,
  themes,
  topics: [
    topic_accidents,
    topic_barriers,
    topic_bikelanes,
    topic_bikelanesPresence_legacy,
    topic_bikelanesPresence,
    topic_boundaries,
    topic_buildings,
    topic_education,
    topic_landuse,
    topic_lit_legacy,
    topic_lit,
    topic_mapillaryCoverage,
    topic_maxspeed_legacy,
    topic_maxspeed,
    topic_parking,
    topic_parkingAreas,
    topic_parkingDebug,
    topic_parkingPoints,
    topic_parkingStats,
    topic_places,
    topic_poiClassification_tarmac,
    topic_publicTransport,
    topic_roadClassification_legacy,
    topic_roadClassification,
    topic_surfaceQuality_legacy,
    topic_surfaceQuality,
    topic_bicycleParking,
  ],
}
