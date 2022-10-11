import { MapDataStyleInteractiveFilter } from '@components/MapInterface/mapData'
import { TopicStyleFilterConfig } from '@components/MapInterface/mapStateConfig'
import produce from 'immer'
import { FilterDataWithConfigState } from './types'

/** @desc We take our filterData (from MapData…), add the `active` from filterConfig and cleanup the `defaultActive` */
export const mergeFilterDataWithConfigState = (
  filtersData: MapDataStyleInteractiveFilter[],
  filtersConfig: TopicStyleFilterConfig[]
) => {
  const mergedFilterDataAndConfig = produce(filtersData, (draft) => {
    draft.forEach((filterData) => {
      filterData.options.forEach((optionData) => {
        delete optionData.defaultActive
        const optionConfig = filtersConfig
          .find((f) => f.id === filterData.id)
          ?.options.find((o) => o.id === optionData.id)
        // @ts-ignore No idea how to get this typed
        optionData.active = optionConfig?.active
      })
    })
  }) as FilterDataWithConfigState[]

  return mergedFilterDataAndConfig
}
