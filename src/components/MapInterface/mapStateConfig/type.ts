import { MapDataThemeIds, TopicIds, TopicStyleIds } from '../mapData'

export type ThemeConfig = {
  id: MapDataThemeIds
  active: boolean
  topics: TopicConfig[]
}

export type TopicConfig = {
  id: TopicIds
  styles: {
    id: TopicStyleIds
    active: boolean
  }[]
}
