// This list defines the topics that we process in the data pipeline.
// Each topic must have a folder /topics/<topic> with the following files:
// - <topic>.lua: the LUA entrypoint for the topic
// - <topic>.sql: an optional SQL file to post-process the data
export const topicList = [
  'roads_bikelanes',
  'bikeroutes',
  'bicycleParking',
  'trafficSigns',
  'boundaries',
  'places',
  'landuse',
  'publicTransport',
  'poiClassification',
  'barriers',
  'parking',
] as const

export type Topic = (typeof topicList)[number]
