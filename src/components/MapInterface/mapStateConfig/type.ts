import {
  TopicIds,
  TopicStyleIds,
  TopicStyleFilterIds,
  MapDataThemeIds,
} from '../mapData'

export type ThemeConfig = {
  id: MapDataThemeIds
  topics: TopicConfig[]
}

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
