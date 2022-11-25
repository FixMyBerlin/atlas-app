import { SourcesIds, TopicIds } from '@components/MapInterface/mapData'

export const extractTopicIdFromSourceKey = (sourceKey: string) => {
  return sourceKey.split('--')[1].replace('topic:', '') as TopicIds
}

export const extractSourceIdIdFromSourceKey = (sourceKey: string) => {
  return sourceKey.split('--')[0].replace('source:', '') as SourcesIds
}
