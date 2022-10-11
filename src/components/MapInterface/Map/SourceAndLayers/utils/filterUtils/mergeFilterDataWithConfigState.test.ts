import { MapDataStyleInteractiveFilter } from '@components/MapInterface/mapData'
import { TopicStyleFilterConfig } from '@components/MapInterface/store'
import { describe, expect, test } from 'vitest'
import { mergeFilterDataWithConfigState } from './mergeFilterDataWithConfigState'

// Source: src/components/MapInterface/mapData/topicsMapDataConfig/topicUnfallatlas.const.ts
export const testFilterData: MapDataStyleInteractiveFilter[] = [
  {
    id: 'category',
    name: 'Unfallort',
    inputType: 'checkbox',
    filterConfig: { lookupKey: 'Unfallort' },
    options: [
      { id: 'Knotenpunkt', name: 'Knoten', defaultActive: true },
      { id: 'Freie Strecke', name: 'Freie Strecke', defaultActive: true },
    ],
  },
  {
    id: 'years',
    name: 'Jahre',
    inputType: 'checkbox',
    filterConfig: { lookupKey: 'UJAHR' },
    options: [
      { id: '2017', name: '2017' },
      { id: '2018', name: '2018', defaultActive: true },
      { id: '2019', name: '2019', defaultActive: true },
    ],
  },
]

export const testFilterConfig: TopicStyleFilterConfig[] = [
  {
    id: 'category',
    options: [
      { id: 'Knotenpunkt', active: true },
      { id: 'Freie Strecke', active: false },
    ],
  },
  {
    id: 'years',
    options: [
      { id: '2017', active: true },
      { id: '2018', active: true },
      { id: '2019', active: false },
    ],
  },
]

describe('mergeFilterDataAndConfig()', () => {
  test('removes the `defaultActive` from filterData and adds the `active` state from filterConfig', () => {
    const filter = mergeFilterDataWithConfigState(
      testFilterData,
      testFilterConfig
    )
    expect(filter[0].options[0].active).toBe(true)
    expect(filter[0].options[1].active).toBe(false)
    // @ts-ignore We know, its just a test…
    expect(filter[0].options[1].defaultActive).toBeUndefined
    expect(filter[1].options[0].active).toBe(true)
    expect(filter[1].options[1].active).toBe(true)
    expect(filter[1].options[2].active).toBe(false)
  })
})
