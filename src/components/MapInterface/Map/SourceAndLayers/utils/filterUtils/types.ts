import {
  MapDataStyleInteractiveFilter,
  MapDataStyleInteractiveFilterOption,
} from '@components/MapInterface/mapData'
import { TopicStyleFilterOptionConfig } from '@components/MapInterface/store'

export type FilterDataWithConfigState = Omit<
  MapDataStyleInteractiveFilter,
  'options'
> & { options: FilterOptionDataWithConfigState[] }

type FilterOptionDataWithConfigState = Omit<
  MapDataStyleInteractiveFilterOption,
  'defaultActive'
> &
  Pick<TopicStyleFilterOptionConfig, 'active'>
