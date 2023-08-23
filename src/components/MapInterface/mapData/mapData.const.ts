import { sources } from './sourcesMapData/sources.const'
import { themes } from './themesMapData'
import {
  TopicAccidentsId,
  TopicAccidentsStyleIds,
  TopicBarriersId,
  TopicBarriersStyleIds,
  TopicBikelanesId,
  TopicBikelanesId_Osmscripts,
  TopicBikelanesPresenceId,
  TopicBikelanesPresenceStyleIds,
  TopicBikelanesStyleIds,
  TopicBikelanesStyleIds_Osmscripts,
  TopicBoundariesId,
  TopicBoundariesStyleIds,
  TopicBuildingsId,
  TopicBuildingsStyleIds,
  TopicEducationId,
  TopicEducationId_Osmscripts,
  TopicEducationStyleIds,
  TopicEducationStyleIds_Osmscripts,
  TopicLanduseId,
  TopicLanduseStyleIds,
  TopicLitId,
  TopicLitStyleIds,
  TopicMapillaryCoverageId,
  TopicMapillaryCoverageStyleIds,
  TopicMaxspeedId,
  TopicMaxspeedStyleIds,
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
  TopicPublicTransportId_Osmscripts,
  TopicPublicTransportStyleIds,
  TopicPublicTransportStyleIds_Osmscripts,
  TopicRoadClassificationId,
  TopicRoadClassificationId_Osmscripts,
  TopicRoadClassificationStyleIds,
  TopicRoadClassificationStyleIds_Osmscripts,
  TopicShopsId_Osmscripts,
  TopicShopsStyleIds_Osmscripts,
  TopicSurfaceId_Osmscripts,
  TopicSurfaceQualityId,
  TopicSurfaceStyleIds_Osmscripts,
  TopicSurfaceStyleQualityIds,
  topic_accidents,
  topic_barriers,
  topic_bikelanes,
  topic_bikelanesPresence,
  topic_bikelanes_osmscripts,
  topic_boundaries,
  topic_buildings,
  topic_education,
  topic_education_osmscripts,
  topic_landuse,
  topic_lit,
  topic_mapillaryCoverage,
  topic_maxspeed,
  topic_parking,
  topic_parkingAreas,
  topic_parkingDebug,
  topic_parkingPoints,
  topic_parkingStats,
  topic_places,
  topic_poiClassification_tarmac,
  topic_publicTransport,
  topic_publicTransport_osmscripts,
  topic_roadClassification,
  topic_roadClassification_osmscripts,
  topic_shops_osmscripts,
  topic_surfaceQuality,
  topic_surface_osmscripts,
} from './topicsMapData'
import { MapData, MapDataTheme } from './types'

export type TopicIds =
  | TopicAccidentsId
  | TopicBarriersId
  | TopicBikelanesId
  | TopicBikelanesId_Osmscripts
  | TopicBikelanesPresenceId
  | TopicBoundariesId
  | TopicBuildingsId
  | TopicEducationId
  | TopicEducationId_Osmscripts
  | TopicLanduseId
  | TopicLitId
  | TopicMapillaryCoverageId
  | TopicMaxspeedId
  | TopicParkingAreasId
  | TopicParkingDebugId
  | TopicParkingId
  | TopicParkingPointsId
  | TopicParkingStatsId
  | TopicPlacesId
  | TopicPoiClassificationId_Tarmac
  | TopicPublicTransportId
  | TopicPublicTransportId_Osmscripts
  | TopicRoadClassificationId
  | TopicRoadClassificationId_Osmscripts
  | TopicShopsId_Osmscripts
  | TopicSurfaceId_Osmscripts
  | TopicSurfaceQualityId

type TopicStyleIdDefaults = MapDataTheme['topics'][number]['defaultStyle']

export type TopicStyleIds =
  | TopicStyleIdDefaults
  | TopicAccidentsStyleIds
  | TopicBarriersStyleIds
  | TopicBikelanesPresenceStyleIds
  | TopicBikelanesStyleIds
  | TopicBikelanesStyleIds_Osmscripts
  | TopicBoundariesStyleIds
  | TopicBuildingsStyleIds
  | TopicEducationStyleIds
  | TopicEducationStyleIds_Osmscripts
  | TopicLanduseStyleIds
  | TopicLitStyleIds
  | TopicMapillaryCoverageStyleIds
  | TopicMaxspeedStyleIds
  | TopicParkingAreasStyleIds
  | TopicParkingDebugStyleIds
  | TopicParkingPointsStyleIds
  | TopicParkingStatsStyleIds
  | TopicParkingStyleIds
  | TopicPlacesStyleIds
  | TopicPoiClassificationStyleIds_Tarmac
  | TopicPublicTransportStyleIds
  | TopicPublicTransportStyleIds_Osmscripts
  | TopicRoadClassificationStyleIds
  | TopicRoadClassificationStyleIds_Osmscripts
  | TopicShopsStyleIds_Osmscripts
  | TopicSurfaceStyleIds_Osmscripts
  | TopicSurfaceStyleQualityIds

export type TopicStyleLegendIds = string // TODO: We can make this more precise later

export const mapData: MapData = {
  sources,
  themes,
  topics: [
    topic_accidents,
    topic_barriers,
    topic_bikelanes_osmscripts,
    topic_bikelanes,
    topic_bikelanesPresence,
    topic_boundaries,
    topic_buildings,
    topic_education_osmscripts,
    topic_education,
    topic_landuse,
    topic_lit,
    topic_mapillaryCoverage,
    topic_maxspeed,
    topic_parking,
    topic_parkingAreas,
    topic_parkingDebug,
    topic_parkingPoints,
    topic_parkingStats,
    topic_places,
    topic_poiClassification_tarmac,
    topic_publicTransport_osmscripts,
    topic_publicTransport,
    topic_roadClassification_osmscripts,
    topic_roadClassification,
    topic_shops_osmscripts,
    topic_surface_osmscripts,
    topic_surfaceQuality,
  ],
}
