import { mapDataConfig, MapDataConfigTopicIds } from '../mapDataConfig.const'

export const getMapDataTopic = (topicId: MapDataConfigTopicIds) => {
  return mapDataConfig.topics.find((t) => t.id === topicId)
}
