import { uniqueArray } from '@components/utils'
import { describe, expect, test } from 'vitest'
import { createMapRegionConfig } from '../createMapRegionConfig'
import { flatConfigTopics } from './flatConfigTopics'

describe('flatConfigTopics()', () => {
  test('Flatten removes duplicate topics', () => {
    const initialMapConfig = createMapRegionConfig({
      regionThemeIds: ['bikelanes', 'lit'],
    })

    // console.log('intialConfig', JSON.stringify(initialMapConfig, undefined, 2))
    const check = uniqueArray(
      initialMapConfig[0].topics.map((t) => t.id),
      initialMapConfig[1].topics.map((t) => t.id)
    ).length

    const result = flatConfigTopics(initialMapConfig)

    // console.log('result', JSON.stringify(result, undefined, 2))
    expect(result.length).toBe(check)
  })
})
