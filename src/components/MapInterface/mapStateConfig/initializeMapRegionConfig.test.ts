import { describe, expect, test } from 'vitest'
import { initializeMapRegionConfig } from './initializeMapRegionConfig'
import { ThemeConfig } from './type'

describe('initializeMapReagionConfig()', () => {
  const freshConfig = [
    {
      id: 'lit',
      topics: [
        {
          id: 'lit',
          styles: [
            { id: 'default', active: true }, // change to false
            { id: 'completeness', active: false }, // change to true
            { id: 'verification', active: false },
            { id: 'freshness', active: false },
          ],
        },
        {
          id: 'places',
          styles: [
            { id: 'default', active: true },
            { id: 'circle', active: false },
          ],
        },
        {
          id: 'landuse',
          styles: [{ id: 'default', active: true }], // change id to name_changed
        },
      ],
    },
    {
      id: 'fromTo',
      topics: [
        {
          id: 'boundaries',
          styles: [
            {
              id: 'default',
              active: true,
            },
          ],
        },
      ],
    },
    {
      id: 'bikelanes',
      topics: [
        {
          id: 'bikelanes',
          styles: [
            {
              id: 'default',
              active: true,
            },
          ],
        },
      ],
    },
  ] satisfies ThemeConfig[]

  test('If nothing changed, nothing is done', () => {
    const result = initializeMapRegionConfig({
      freshConfig,
      urlConfig: freshConfig,
    })

    expect(result).toMatchObject(freshConfig)
  })

  test('`active` states are re-applied (if `id` stayed the same)', () => {
    const urlConfig = structuredClone(freshConfig)
    urlConfig[0].topics[0].styles[0].active = false // topic:lit style-id:default
    urlConfig[0].topics[0].styles[1].active = true // topic:lit style-id:completenes

    const result = initializeMapRegionConfig({
      freshConfig,
      urlConfig,
    })

    // console.log('result', JSON.stringify(result, undefined, 2))
    // console.log('urlConfig', JSON.stringify(urlConfig, undefined, 2))
    // console.log('freshConfig', JSON.stringify(freshConfig, undefined, 2))
    expect(result).toMatchObject(urlConfig)
  })

  test('New config entries are added (with default active state); UseCase url config is missing options that where added later', () => {
    const urlConfig = structuredClone(freshConfig)
    delete urlConfig[0].topics[1] // topic:lit topic:landuse style removed
    delete urlConfig[0].topics[2].styles[1] // topic:lit topic:landuse style removed
    delete urlConfig[2] // topic:bikelanes

    const result = initializeMapRegionConfig({
      freshConfig,
      urlConfig,
    })

    // console.log('result', JSON.stringify(result, undefined, 2))
    // console.log('urlConfig', JSON.stringify(urlConfig, undefined, 2))
    // console.log('freshConfig', JSON.stringify(freshConfig, undefined, 2))
    expect(result).toMatchObject(freshConfig)
  })

  test('Deleted/old config entries are ignored; UseCase url config holds old entries that where removed now.', () => {
    const urlConfig = structuredClone(freshConfig)
    // @ts-expect-error the object structure is checked manually
    urlConfig[0].topics[2].styles[0].id = 'now_removed_style' // topic:lit topic:landuse style:id changed

    const result = initializeMapRegionConfig({
      freshConfig,
      urlConfig,
    })

    // console.log('result', JSON.stringify(result, undefined, 2))
    // console.log('urlConfig', JSON.stringify(urlConfig, undefined, 2))
    // console.log('freshConfig', JSON.stringify(freshConfig, undefined, 2))
    expect(result).toMatchObject(freshConfig)
  })
})
