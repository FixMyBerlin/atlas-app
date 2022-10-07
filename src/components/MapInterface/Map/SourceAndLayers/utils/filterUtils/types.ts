import {
  MapDataConfigStyleInteractiveFilter,
  MapDataConfigStyleInteractiveFilterOption,
} from '@components/MapInterface/mapData'
import { TopicStyleFilterOptionConfig } from '@components/MapInterface/store'

export type FilterDataWithConfigState = Omit<
  MapDataConfigStyleInteractiveFilter,
  'options'
> & { options: FilterOptionDataWithConfigState[] }

type FilterOptionDataWithConfigState = Omit<
  MapDataConfigStyleInteractiveFilterOption,
  'defaultActive'
> &
  Pick<TopicStyleFilterOptionConfig, 'active'>
