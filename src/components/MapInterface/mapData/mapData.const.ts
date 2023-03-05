import { sources } from './sourcesMapData/sources.const'
import { themes } from './themesMapData'
import {
  TopicAccidentsId,
  TopicAccidentsStyleFilterIds,
  TopicAccidentsStyleIds,
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
  TopicEducationId_Osmscripts,
  TopicEducationId_Tarmac,
  TopicEducationStyleFilterIds_Osmscripts,
  TopicEducationStyleFilterIds_Tarmac,
  TopicEducationStyleIds_Osmscripts,
  TopicEducationStyleIds_Tarmac,
  TopicLanduseId,
  TopicLanduseStyleFilterIds,
  TopicLanduseStyleIds,
  TopicLitId,
  TopicLitStyleFilterIds,
  TopicLitStyleIds,
  TopicLitStyleLegendIds,
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
  TopicParkingStatsId,
  TopicParkingPointsStyleFilterIds,
  TopicParkingStatsStyleFilterIds,
  TopicParkingPointsStyleIds,
  TopicParkingStatsStyleIds,
  TopicParkingStyleFilterIds,
  TopicParkingStyleIds,
  TopicPlacesId,
  TopicBuildingsId,
  TopicPlacesStyleFilterIds,
  TopicBuildingsStyleFilterIds,
  TopicPlacesStyleIds,
  TopicBuildingsStyleIds,
  TopicPoiClassificationId_Tarmac,
  TopicPoiClassificationStyleFilterIds_Tarmac,
  TopicPoiClassificationStyleIds_Tarmac,
  TopicPublicTransportId_Osmscripts,
  TopicPublicTransportId_Tarmac,
  TopicPublicTransportStyleFilterIds_Osmscripts,
  TopicPublicTransportStyleFilterIds_Tarmac,
  TopicPublicTransportStyleIds_Osmscripts,
  TopicPublicTransportStyleIds_Tarmac,
  TopicRoadClassificationId_Osmscripts,
  TopicRoadClassificationId_Tarmac,
  TopicRoadClassificationStyleFilterIds_Osmscripts,
  TopicRoadClassificationStyleFilterIds_Tarmac,
  TopicRoadClassificationStyleIds_Osmscripts,
  TopicRoadClassificationStyleIds_Tarmac,
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
  topic_bikelanes,
  topic_bikelanesPresence,
  topic_bikelanes_osmscripts,
  topic_boundaries,
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
  topic_publicTransport_osmscripts,
  topic_publicTransport_tarmac,
  topic_roadClassification_osmscripts,
  topic_roadClassification_tarmac,
  topic_shops_osmscripts,
  topic_surface_osmscripts,
  topic_buildings,
} from './topicsMapData'
import { MapData } from './types'

export type TopicIds =
  | TopicAccidentsId
  | TopicBikelanesId
  | TopicBikelanesId_Osmscripts
  | TopicBikelanesPresenceId
  | TopicBoundariesId
  | TopicBuildingsId
  | TopicEducationId_Osmscripts
  | TopicEducationId_Tarmac
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
  | TopicPublicTransportId_Osmscripts
  | TopicPublicTransportId_Tarmac
  | TopicRoadClassificationId_Osmscripts
  | TopicRoadClassificationId_Tarmac
  | TopicShopsId_Osmscripts
  | TopicSurfaceId_Osmscripts
  | TopicSurfaceId_Tarmac

export type TopicStyleIds =
  | TopicAccidentsStyleIds
  | TopicBikelanesPresenceStyleIds
  | TopicBikelanesStyleIds
  | TopicBikelanesStyleIds_Osmscripts
  | TopicBoundariesStyleIds
  | TopicBuildingsStyleIds
  | TopicEducationStyleIds_Osmscripts
  | TopicEducationStyleIds_Tarmac
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
  | TopicPublicTransportStyleIds_Osmscripts
  | TopicPublicTransportStyleIds_Tarmac
  | TopicRoadClassificationStyleIds_Osmscripts
  | TopicRoadClassificationStyleIds_Tarmac
  | TopicShopsStyleIds_Osmscripts
  | TopicSurfaceStyleIds_Osmscripts
  | TopicSurfaceStyleIds_Tarmac

export type TopicStyleFilterIds =
  | TopicAccidentsStyleFilterIds
  | TopicBikelanesPresenceStyleFilterIds
  | TopicBikelanesStyleFilterIds
  | TopicBikelanesStyleFilterIds_Osmscripts
  | TopicBoundariesStyleFilterIds
  | TopicBuildingsStyleFilterIds
  | TopicEducationStyleFilterIds_Osmscripts
  | TopicEducationStyleFilterIds_Tarmac
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
  | TopicPublicTransportStyleFilterIds_Osmscripts
  | TopicPublicTransportStyleFilterIds_Tarmac
  | TopicRoadClassificationStyleFilterIds_Osmscripts
  | TopicRoadClassificationStyleFilterIds_Tarmac
  | TopicShopsStyleFilterIds_Osmscripts
  | TopicSurfaceStyleFilterIds_Osmscripts
  | TopicSurfaceStyleFilterIds_Tarmac

export type TopicStyleLegendIds =
  // | TopicAccidentsStyleLegendIds
  // | TopicBikelanesStyleLegendIds_Osmscripts
  // | TopicBikelanesPresenceStyleLegendIds_Osmscripts
  // | TopicBikelanesStyleLegendIds_Tarmac
  // | TopicBikelanesPresenceStyleLegendIds_Tarmac
  // | TopicBoundariesStyleLegendIds
  // | TopicEducationStyleLegendIds_Osmscripts
  // | TopicEducationStyleLegendIds_Tarmac
  // | TopicLanduseStyleLegendIds
  TopicLitStyleLegendIds
// | TopicMapillaryCoverageStyleLegendIds
// | TopicPlacesStyleLegendIds
// | TopicBuildingsStyleLegendIds
// | TopicMaxspeedStyleLegendIds
// | TopicPublicTransportStyleLegendIds_Osmscripts
// | TopicPublicTransportStyleLegendIds_Tarmac
// | TopicRoadClassificationStyleLegendIds_Osmscripts
// | TopicRoadClassificationStyleLegendIds_Tarmac
// | TopicShopsStyleLegendIds_Osmscripts
// | TopicPoiClassificationStyleLegendIds_Tarmac
// | TopicSurfaceStyleLegendIds_Osmscripts
// | TopicSurfaceStyleLegendIds_Tarmac
// | TopicParkingStyleLegendIds
// | TopicParkingPointsStyleLegendIds
// | TopicParkingStatsStyleLegendIds
// | TopicParkingAreasStyleLegendIds

export const mapData: MapData = {
  sources,
  themes,
  topics: [
    topic_accidents,
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
    topic_places,
    topic_poiClassification_tarmac,
    topic_publicTransport_osmscripts,
    topic_publicTransport_tarmac,
    topic_roadClassification_osmscripts,
    topic_roadClassification_tarmac,
    topic_shops_osmscripts,
    topic_surface_osmscripts,
    // topic_surface_tarmac,
    topic_parking,
    topic_parkingAreas,
    topic_parkingDebug,
    topic_parkingPoints,
    topic_parkingStats,
  ],
}
