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

export type MapDataConfigTopicStyleIds =
  | TopicBoundariesStyleIds
  | TopicParkingStyleIds
  | TopicUnfallatlasStyleIds
  | TopicTarmacSurfaceStyleIds

export type MapDataConfigTopicStyleFilterIds =
  | TopicBoundariesStyleFilterIds
  | TopicParkingStyleFilterIds
  | TopicUnfallatlasStyleFilterIds
  | TopicTarmacSurfaceStyleFilterIds

export const mapDataConfig: MapDataConfig = {
  sources,
  themes,
  // topics: [topicBoundaries, topicParking, topicUnfallatlas, topicTarmacSurface],
  topics: [topicBoundaries, topicParking, topicUnfallatlas],
}
