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
  'helper',
] as const

export type Topic = (typeof topicList)[number]

export const projects: {
  name: string
  topics: Topic[]
  default: boolean
  bbox: [number, number, number, number] | undefined
}[] = [
  {
    name: 'tilda',
    topics: [
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
    ],
    default: true,
    bbox: undefined,
  },
  {
    name: 'parking',
    topics: ['parking'],
    default: false,
    bbox: [9.0671, 48.9229, 9.1753, 48.9838],
  },
]
