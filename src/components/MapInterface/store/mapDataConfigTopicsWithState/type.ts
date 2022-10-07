import {
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleIds,
  MapDataConfigTopicStyleFilterIds,
} from '../../mapData'

export type TopicConfig = {
  id: MapDataConfigTopicIds
  active: boolean
  styles: {
    id: MapDataConfigTopicStyleIds
    active: boolean
    filters: null | TopicStyleFilterConfig[]
  }[]
}

export type TopicStyleFilterConfig = {
  id: MapDataConfigTopicStyleFilterIds
  options: {
    id: string
    active: boolean
  }[]
}

export type TopicsConfig = TopicConfig[]
