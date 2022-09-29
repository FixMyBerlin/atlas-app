import { sourcesBackgroundsRaster } from './sourcesMapDataConfig'
import { sources } from './sourcesMapDataConfig/sources.const'
import { themes } from './themesMapDataConfig'
import {
  topicBoundaries,
  TopicBoundariesId,
  TopicBoundariesStyleFilterIds,
  TopicBoundariesStyleIds,
  topicParking,
  TopicParkingId,
  TopicParkingStyleFilterIds,
  TopicParkingStyleIds,
  topicTarmacBikelanes,
  TopicTarmacBikelanesId,
  TopicTarmacBikelanesStyleFilterIds,
  TopicTarmacBikelanesStyleIds,
  topicTarmacHighwayClassification,
  topicMapillaryCoverage,
  TopicTarmacHighwayClassificationId,
  TopicMapillaryCoverageId,
  TopicTarmacHighwayClassificationStyleFilterIds,
  TopicMapillaryCoverageStyleFilterIds,
  TopicTarmacHighwayClassificationStyleIds,
  TopicMapillaryCoverageStyleIds,
  topicTarmacSurface,
  TopicTarmacSurfaceId,
  TopicTarmacSurfaceStyleFilterIds,
  TopicTarmacSurfaceStyleIds,
  topicUnfallatlas,
  TopicUnfallatlasId,
  TopicUnfallatlasStyleFilterIds,
  TopicUnfallatlasStyleIds,
} from './topicsMapDataConfig'
import { MapDataConfig } from './types'

export type MapDataConfigTopicIds =
  | TopicBoundariesId
  | TopicParkingId
  | TopicUnfallatlasId
  | TopicTarmacSurfaceId
  | TopicTarmacBikelanesId
  | TopicTarmacHighwayClassificationId
  | TopicMapillaryCoverageId

export type MapDataConfigTopicStyleIds =
  | TopicBoundariesStyleIds
  | TopicParkingStyleIds
  | TopicUnfallatlasStyleIds
  | TopicTarmacSurfaceStyleIds
  | TopicTarmacBikelanesStyleIds
  | TopicTarmacHighwayClassificationStyleIds
  | TopicMapillaryCoverageStyleIds

export type MapDataConfigTopicStyleFilterIds =
  | TopicBoundariesStyleFilterIds
  | TopicParkingStyleFilterIds
  | TopicUnfallatlasStyleFilterIds
  | TopicTarmacSurfaceStyleFilterIds
  | TopicTarmacBikelanesStyleFilterIds
  | TopicTarmacHighwayClassificationStyleFilterIds
  | TopicMapillaryCoverageStyleFilterIds

export const mapDataConfig: MapDataConfig = {
  sources,
  backgrounds: sourcesBackgroundsRaster,
  themes,
  topics: [
    topicBoundaries,
    topicParking,
    topicUnfallatlas,
    topicTarmacSurface,
    topicTarmacBikelanes,
    topicTarmacHighwayClassification,
    topicMapillaryCoverage,
  ],
}
