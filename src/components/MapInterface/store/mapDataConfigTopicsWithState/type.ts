import {
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleIds,
  MapDataConfigTopicStyleFilterIds,
} from '../../mapData'

export type MapDataConfigTopicWithState = {
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
}

export type MapDataConfigTopicsWithState = MapDataConfigTopicWithState[]
