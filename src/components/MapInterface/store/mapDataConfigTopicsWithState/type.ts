import {
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleIds,
  MapDataConfigTopicStyleFilterIds,
} from '../../Map/mapData'

export type MapDataConfigTopicsWithState = {
  id: MapDataConfigTopicIds
  active: boolean
  styles: {
    id: MapDataConfigTopicStyleIds
    active: boolean
    filters:
      | null
      | {
          id: MapDataConfigTopicStyleFilterIds
          options: {
            id: string
            active: boolean
          }[]
        }[]
  }[]
}[]
