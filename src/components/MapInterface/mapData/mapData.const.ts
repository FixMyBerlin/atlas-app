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
  TopicParkingAreasId,
  TopicParkingAreasStyleFilterIds,
  TopicParkingAreasStyleIds,
  TopicParkingId,
  TopicParkingPointsId,
  TopicParkingPointsStyleFilterIds,
  TopicParkingPointsStyleIds,
  TopicParkingStyleFilterIds,
  TopicParkingStyleIds,
  TopicPlacesId,
  TopicPlacesStyleFilterIds,
  TopicPlacesStyleIds,
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
  topic_parking,
  topic_parkingAreas,
  topic_parkingPoints,
  topic_places,
  topic_poiClassification_tarmac,
  topic_publicTransport_osmscripts,
  topic_publicTransport_tarmac,
  topic_roadClassification_osmscripts,
  topic_roadClassification_tarmac,
  topic_shops_osmscripts,
  topic_surface_osmscripts,
} from './topicsMapData'
import { MapData } from './types'

export type TopicIds =
  | TopicAccidentsId
  | TopicBikelanesId_Osmscripts
  | TopicBikelanesId
  | TopicBikelanesPresenceId
  | TopicBoundariesId
  | TopicEducationId_Osmscripts
  | TopicEducationId_Tarmac
  | TopicLanduseId
  | TopicLitId
  | TopicMapillaryCoverageId
  | TopicPlacesId
  | TopicPublicTransportId_Osmscripts
  | TopicPublicTransportId_Tarmac
  | TopicRoadClassificationId_Osmscripts
  | TopicRoadClassificationId_Tarmac
  | TopicShopsId_Osmscripts
  | TopicPoiClassificationId_Tarmac
  | TopicSurfaceId_Osmscripts
  | TopicSurfaceId_Tarmac
  | TopicParkingId
  | TopicParkingPointsId
  | TopicParkingAreasId

export type TopicStyleIds =
  | TopicAccidentsStyleIds
  | TopicBikelanesStyleIds_Osmscripts
  | TopicBikelanesStyleIds
  | TopicBikelanesPresenceStyleIds
  | TopicBoundariesStyleIds
  | TopicEducationStyleIds_Osmscripts
  | TopicEducationStyleIds_Tarmac
  | TopicLanduseStyleIds
  | TopicLitStyleIds
  | TopicMapillaryCoverageStyleIds
  | TopicPlacesStyleIds
  | TopicPublicTransportStyleIds_Osmscripts
  | TopicPublicTransportStyleIds_Tarmac
  | TopicRoadClassificationStyleIds_Osmscripts
  | TopicRoadClassificationStyleIds_Tarmac
  | TopicShopsStyleIds_Osmscripts
  | TopicPoiClassificationStyleIds_Tarmac
  | TopicSurfaceStyleIds_Osmscripts
  | TopicSurfaceStyleIds_Tarmac
  | TopicParkingStyleIds
  | TopicParkingPointsStyleIds
  | TopicParkingAreasStyleIds

export type TopicStyleFilterIds =
  | TopicAccidentsStyleFilterIds
  | TopicBikelanesStyleFilterIds_Osmscripts
  | TopicBikelanesStyleFilterIds
  | TopicBikelanesPresenceStyleFilterIds
  | TopicBoundariesStyleFilterIds
  | TopicEducationStyleFilterIds_Osmscripts
  | TopicEducationStyleFilterIds_Tarmac
  | TopicLanduseStyleFilterIds
  | TopicLitStyleFilterIds
  | TopicMapillaryCoverageStyleFilterIds
  | TopicPlacesStyleFilterIds
  | TopicPublicTransportStyleFilterIds_Osmscripts
  | TopicPublicTransportStyleFilterIds_Tarmac
  | TopicRoadClassificationStyleFilterIds_Osmscripts
  | TopicRoadClassificationStyleFilterIds_Tarmac
  | TopicShopsStyleFilterIds_Osmscripts
  | TopicPoiClassificationStyleFilterIds_Tarmac
  | TopicSurfaceStyleFilterIds_Osmscripts
  | TopicSurfaceStyleFilterIds_Tarmac
  | TopicParkingStyleFilterIds
  | TopicParkingPointsStyleFilterIds
  | TopicParkingAreasStyleFilterIds

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
    topic_education,
    topic_education_osmscripts,
    topic_landuse,
    topic_lit,
    topic_mapillaryCoverage,
    topic_places,
    topic_publicTransport_osmscripts,
    topic_publicTransport_tarmac,
    topic_roadClassification_osmscripts,
    topic_roadClassification_tarmac,
    topic_shops_osmscripts,
    topic_poiClassification_tarmac,
    topic_surface_osmscripts,
    // topic_surface_tarmac,
    topic_parking,
    topic_parkingPoints,
    topic_parkingAreas,
  ],
}
