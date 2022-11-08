import { sourcesBackgroundsRaster } from './sourcesMapData'
import { sources } from './sourcesMapData/sources.const'
import { themes } from './themesMapData'
import {
  TopicAccidentsId,
  TopicAccidentsStyleFilterIds,
  TopicAccidentsStyleIds,
  TopicBikelanesId_Osmscripts,
  TopicBikelanesId_Tarmac,
  TopicBikelanesStyleFilterIds_Osmscripts,
  TopicBikelanesStyleFilterIds_Tarmac,
  TopicBikelanesStyleIds_Osmscripts,
  TopicBikelanesStyleIds_Tarmac,
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
  TopicMapillaryCoverageId,
  TopicMapillaryCoverageStyleFilterIds,
  TopicMapillaryCoverageStyleIds,
  topicParking,
  TopicParkingId,
  TopicParkingStyleFilterIds,
  TopicParkingStyleIds,
  TopicPlacesId,
  TopicPlacesStyleFilterIds,
  TopicPlacesStyleIds,
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
  TopicPoiClassificationId_Tarmac,
  TopicShopsStyleFilterIds_Osmscripts,
  TopicPoiClassificationStyleFilterIds_Tarmac,
  TopicShopsStyleIds_Osmscripts,
  TopicPoiClassificationStyleIds_Tarmac,
  TopicSurfaceId_Osmscripts,
  TopicSurfaceId_Tarmac,
  TopicSurfaceStyleFilterIds_Osmscripts,
  TopicSurfaceStyleFilterIds_Tarmac,
  TopicSurfaceStyleIds_Osmscripts,
  TopicSurfaceStyleIds_Tarmac,
  topic_accidents,
  topic_bikelanes_osmscripts,
  topic_bikelanes_tarmac,
  topic_boudaries,
  topic_education_osmscripts,
  topic_education_tarmac,
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
} from './topicsMapData'
import { MapData } from './types'

export type TopicIds =
  | TopicAccidentsId
  | TopicBikelanesId_Osmscripts
  | TopicBikelanesId_Tarmac
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

export type TopicStyleIds =
  | TopicAccidentsStyleIds
  | TopicBikelanesStyleIds_Osmscripts
  | TopicBikelanesStyleIds_Tarmac
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

export type TopicStyleFilterIds =
  | TopicAccidentsStyleFilterIds
  | TopicBikelanesStyleFilterIds_Osmscripts
  | TopicBikelanesStyleFilterIds_Tarmac
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

export const mapData: MapData = {
  sources,
  backgrounds: sourcesBackgroundsRaster,
  themes,
  topics: [
    topic_accidents,
    topic_bikelanes_osmscripts,
    topic_bikelanes_tarmac,
    topic_boudaries,
    topic_education_tarmac,
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
    topicParking,
  ],
}
