import { uniqueArray } from '@components/utils'
import { describe, expect, test } from 'vitest'
import { createMapRegionConfig } from '../createMapRegionConfig'
import { flatConfigTopics } from './flatConfigTopics'

describe('flatConfigTopics()', () => {
  test('No layerFilter either', () => {
    const initialMapConfig = createMapRegionConfig({
      regionThemeIds: ['fromTo', 'lit'],
    })
    console.log('intialConfig', JSON.stringify(initialMapConfig, undefined, 2))
    const check = uniqueArray(
      initialMapConfig[0].topics.map((t) => t.id),
      initialMapConfig[1].topics.map((t) => t.id)
    ).length
    initialMapConfig[0].topics.length + initialMapConfig[1].topics.length
    const result = flatConfigTopics(initialMapConfig)
    console.log('result', JSON.stringify(result, undefined, 2))
    expect(result.length).toBe(check)
  })
})
