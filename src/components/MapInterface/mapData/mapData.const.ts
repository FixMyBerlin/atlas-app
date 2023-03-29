import { sources } from './sourcesMapData/sources.const'
import { themes } from './themesMapData'
import {
  TopicAccidentsId,
  TopicAccidentsStyleFilterIds,
  TopicAccidentsStyleIds,
  TopicBarriersId,
  TopicBarriersStyleFilterIds,
  TopicBarriersStyleIds,
  TopicBikelanesId,
  TopicBikelanesId_Osmscripts,
  TopicBikelanesPresenceId,
  TopicBikelanesPresenceStyleFilterIds,
  TopicBikelanesPresenceStyleIds,
  TopicBikelanesStyleFilterIds,
  TopicBikelanesStyleFilterIds_Osmscripts,
  TopicBikelanesStyleIds,
  TopicBikelanesStyleIds_Osmscripts,
  TopicBoundariesId,
  TopicBoundariesStyleFilterIds,
  TopicBoundariesStyleIds,
  TopicBuildingsId,
  TopicBuildingsStyleFilterIds,
  TopicBuildingsStyleIds,
  TopicEducationId,
  TopicEducationId_Osmscripts,
  TopicEducationStyleFilterIds,
  TopicEducationStyleFilterIds_Osmscripts,
  TopicEducationStyleIds,
  TopicEducationStyleIds_Osmscripts,
  TopicLanduseId,
  TopicLanduseStyleFilterIds,
  TopicLanduseStyleIds,
  TopicLitId,
  TopicLitStyleFilterIds,
  TopicLitStyleIds,
  TopicMapillaryCoverageId,
  TopicMapillaryCoverageStyleFilterIds,
  TopicMapillaryCoverageStyleIds,
  TopicMaxspeedId,
  TopicMaxspeedStyleFilterIds,
  TopicMaxspeedStyleIds,
  TopicParkingAreasId,
  TopicParkingAreasStyleFilterIds,
  TopicParkingAreasStyleIds,
  TopicParkingDebugId,
  TopicParkingDebugStyleFilterIds,
  TopicParkingDebugStyleIds,
  TopicParkingId,
  TopicParkingPointsId,
  TopicParkingPointsStyleFilterIds,
  TopicParkingPointsStyleIds,
  TopicParkingStatsId,
  TopicParkingStatsStyleFilterIds,
  TopicParkingStatsStyleIds,
  TopicParkingStyleFilterIds,
  TopicParkingStyleIds,
  TopicPlacesId,
  TopicPlacesStyleFilterIds,
  TopicPlacesStyleIds,
  TopicPoiClassificationId_Tarmac,
  TopicPoiClassificationStyleFilterIds_Tarmac,
  TopicPoiClassificationStyleIds_Tarmac,
  TopicPublicTransportId,
  TopicPublicTransportId_Osmscripts,
  TopicPublicTransportStyleFilterIds,
  TopicPublicTransportStyleFilterIds_Osmscripts,
  TopicPublicTransportStyleIds,
  TopicPublicTransportStyleIds_Osmscripts,
  TopicRoadClassificationId,
  TopicRoadClassificationId_Osmscripts,
  TopicRoadClassificationStyleFilterIds,
  TopicRoadClassificationStyleFilterIds_Osmscripts,
  TopicRoadClassificationStyleIds,
  TopicRoadClassificationStyleIds_Osmscripts,
  TopicShopsId_Osmscripts,
  TopicShopsStyleFilterIds_Osmscripts,
  TopicShopsStyleIds_Osmscripts,
  TopicSurfaceId_Osmscripts,
  TopicSurfaceId_Tarmac,
  TopicSurfaceStyleFilterIds_Osmscripts,
  TopicSurfaceStyleFilterIds_Tarmac,
  TopicSurfaceStyleIds_Osmscripts,
  TopicSurfaceStyleIds_Tarmac,
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
  topic_surface_osmscripts,
} from './topicsMapData'
import { MapData } from './types'

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
  | TopicSurfaceId_Tarmac

export type TopicStyleIds =
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
  | TopicSurfaceStyleIds_Tarmac

export type TopicStyleFilterIds =
  | TopicAccidentsStyleFilterIds
  | TopicBarriersStyleFilterIds
  | TopicBikelanesPresenceStyleFilterIds
  | TopicBikelanesStyleFilterIds
  | TopicBikelanesStyleFilterIds_Osmscripts
  | TopicBoundariesStyleFilterIds
  | TopicBuildingsStyleFilterIds
  | TopicEducationStyleFilterIds
  | TopicEducationStyleFilterIds_Osmscripts
  | TopicLanduseStyleFilterIds
  | TopicLitStyleFilterIds
  | TopicMapillaryCoverageStyleFilterIds
  | TopicMaxspeedStyleFilterIds
  | TopicParkingAreasStyleFilterIds
  | TopicParkingDebugStyleFilterIds
  | TopicParkingPointsStyleFilterIds
  | TopicParkingStatsStyleFilterIds
  | TopicParkingStyleFilterIds
  | TopicPlacesStyleFilterIds
  | TopicPoiClassificationStyleFilterIds_Tarmac
  | TopicPublicTransportStyleFilterIds
  | TopicPublicTransportStyleFilterIds_Osmscripts
  | TopicRoadClassificationStyleFilterIds
  | TopicRoadClassificationStyleFilterIds_Osmscripts
  | TopicShopsStyleFilterIds_Osmscripts
  | TopicSurfaceStyleFilterIds_Osmscripts
  | TopicSurfaceStyleFilterIds_Tarmac

export type TopicStyleLegendIds = string // TODO: We can make this more precise later

export const mapData: MapData = {
  sources,
  themes,
  topics: [
    // topic_surface_tarmac,
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
  ],
}
