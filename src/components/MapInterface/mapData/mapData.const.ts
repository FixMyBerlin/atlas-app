import { sources } from './sourcesMapData/sources.const'
import { themes } from './themesMapData'
import {
  TopicAccidentsId,
  TopicAccidentsStyleIds,
  TopicBarriersId,
  TopicBarriersStyleIds,
  TopicBikelanesId,
  TopicBikelanesPresenceId,
  TopicBikelanesPresenceIdLegacy,
  TopicBikelanesPresenceStyleIds,
  TopicBikelanesPresenceStyleIdsLegacy,
  TopicBikelanesStyleIds,
  TopicBoundariesId,
  TopicBoundariesStyleIds,
  TopicBuildingsId,
  TopicBuildingsStyleIds,
  TopicEducationId,
  TopicEducationStyleIds,
  TopicLanduseId,
  TopicLanduseStyleIds,
  TopicLitId,
  TopicLitIdLegacy,
  TopicLitStyleIds,
  TopicLitStyleIdsLegacy,
  TopicMapillaryCoverageId,
  TopicMapillaryCoverageStyleIds,
  TopicMaxspeedId,
  TopicMaxspeedIdLegacy,
  TopicMaxspeedStyleIds,
  TopicMaxspeedStyleIdsLegacy,
  TopicParkingAreasId,
  TopicParkingAreasStyleIds,
  TopicParkingDebugId,
  TopicParkingDebugStyleIds,
  TopicParkingId,
  TopicParkingPointsId,
  TopicParkingPointsStyleIds,
  TopicParkingStatsId,
  TopicParkingStatsStyleIds,
  TopicParkingStyleIds,
  TopicPlacesId,
  TopicPlacesStyleIds,
  TopicPoiClassificationId_Tarmac,
  TopicPoiClassificationStyleIds_Tarmac,
  TopicPublicTransportId,
  TopicPublicTransportStyleIds,
  TopicRoadClassificationId,
  TopicRoadClassificationIdLegacy,
  TopicRoadClassificationStyleIds,
  TopicRoadClassificationStyleIdsLegacy,
  TopicSurfaceQualityId,
  TopicSurfaceQualityIdLegacy,
  TopicSurfaceStyleQualityIds,
  TopicSurfaceStyleQualityIdsLegacy,
  topic_accidents,
  topic_barriers,
  topic_bikelanes,
  topic_bikelanesPresence,
  topic_bikelanesPresence_legacy,
  topic_boundaries,
  topic_buildings,
  topic_education,
  topic_landuse,
  topic_lit,
  topic_lit_legacy,
  topic_mapillaryCoverage,
  topic_maxspeed,
  topic_maxspeed_legacy,
  topic_parking,
  topic_parkingAreas,
  topic_parkingDebug,
  topic_parkingPoints,
  topic_parkingStats,
  topic_places,
  topic_poiClassification_tarmac,
  topic_publicTransport,
  topic_roadClassification,
  topic_roadClassification_legacy,
  topic_surfaceQuality,
  topic_surfaceQuality_legacy,
} from './topicsMapData'
import { MapData, MapDataTheme } from './types'

export type TopicIds =
  | TopicAccidentsId
  | TopicBarriersId
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
    topic_bikelanesPresence,
    topic_bikelanesPresence_legacy,
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
  ],
}
