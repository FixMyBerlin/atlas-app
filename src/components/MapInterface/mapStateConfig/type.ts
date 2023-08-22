import { MapDataThemeIds, TopicIds, TopicStyleIds } from '../mapData'

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
  }[]
}
