import { TopicIds, TopicStyleIds, TopicStyleFilterIds } from '../../mapData'

export type TopicConfig = {
  id: TopicIds
  active: boolean
  styles: {
    id: TopicStyleIds
    active: boolean
    filters: null | TopicStyleFilterConfig[]
  }[]
}

export type TopicStyleFilterConfig = {
  id: TopicStyleFilterIds
  options: TopicStyleFilterOptionConfig[]
}

export type TopicStyleFilterOptionConfig = {
  id: string
  active: boolean
}

export type TopicsConfig = TopicConfig[]
