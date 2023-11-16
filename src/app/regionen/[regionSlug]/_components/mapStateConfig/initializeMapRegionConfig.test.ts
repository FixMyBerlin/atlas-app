import { describe, expect, test } from 'vitest'
import { initializeMapRegionConfig } from './initializeMapRegionConfig'
import { CategoryConfig } from './type'

describe('initializeMapReagionConfig()', () => {
  const freshConfig = [
    {
      id: 'lit',
      active: true,
      subcategories: [
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
      active: false,
      subcategories: [
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
      active: false,
      subcategories: [
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
  ] satisfies CategoryConfig[]

  test('If nothing changed, nothing is done', () => {
    const result = initializeMapRegionConfig({
      freshConfig,
      urlConfig: freshConfig,
    })

    expect(result).toMatchObject(freshConfig)
  })

  test('`active` states are re-applied (if `id` stayed the same)', () => {
    const urlConfig = structuredClone(freshConfig)
    urlConfig[0]!.subcategories[0]!.styles[0]!.active = false // subcategory:lit style-id:default
    urlConfig[0]!.subcategories[0]!.styles[1]!.active = true // subcategory:lit style-id:completenes

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
    delete urlConfig[0]!.subcategories[1] // subcategory:lit subcategory:landuse style removed
    delete urlConfig[0]!.subcategories[2]!.styles[1] // subcategory:lit subcategory:landuse style removed
    delete urlConfig[2] // subcategory:bikelanes

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
    urlConfig[0].subcategories[2].styles[0].id = 'now_removed_style' // subcategory:lit subcategory:landuse style:id changed

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
