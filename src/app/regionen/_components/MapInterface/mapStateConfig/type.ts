import { TopicIds, TopicStyleIds } from '../mapData/mapData.const'
import { MapDataThemeIds } from '../mapData/themesMapData/themes.const'

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
