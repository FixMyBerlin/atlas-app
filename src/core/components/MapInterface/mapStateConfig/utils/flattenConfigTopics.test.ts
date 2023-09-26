import { uniqueArray } from 'src/core/utils'
import { describe, expect, test } from 'vitest'
import { createMapRegionConfig } from '../createMapRegionConfig'
import { flattenConfigTopics } from './flattenConfigTopics'

describe('flattenConfigTopics()', () => {
  test('Flatten removes duplicate topics', () => {
    const initialMapConfig = createMapRegionConfig(['bikelanes', 'lit'])

    // console.log('intialConfig', JSON.stringify(initialMapConfig, undefined, 2))
    const check = uniqueArray(
      initialMapConfig[0].topics.map((t) => t.id),
      initialMapConfig[1].topics.map((t) => t.id),
    ).length

    const result = flattenConfigTopics(initialMapConfig)

    // console.log('result', JSON.stringify(result, undefined, 2))
    expect(result.length).toBe(check)
  })
})
