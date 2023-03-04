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
          active: true,
          styles: [
            { id: 'default', active: true }, // change to false
            { id: 'atlas_lit_complete', active: false }, // change to true
            { id: 'atlas_lit_verified', active: false },
            { id: 'atlas_lit_fresh', active: false },
          ],
        },
        {
          id: 'places',
          active: false, // change to true
          styles: [
            { id: 'default', active: true },
            { id: 'atlas_placescircle', active: false },
          ],
        },
        {
          id: 'landuse',
          active: false,
          styles: [{ id: 'default', active: true }], // change id to name_changed
        },
      ],
    },
    {
      id: 'fromTo',
      topics: [
        {
          id: 'boundaries',
          active: true,
          styles: [
            {
              id: 'default',
              active: true,
              filters: [
                {
                  id: 'admin_level',
                  options: [
                    { id: '7', active: false }, // change id to 'id_changed', change to true
                    { id: '8', active: true },
                  ],
                },
              ],
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
          active: true,
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
    urlConfig[0].topics[0].active = false // topic:lit
    urlConfig[0].topics[0].styles[0].active = false // topic:lit style-id:default
    urlConfig[0].topics[0].styles[1].active = true // topic:lit style-id:atlas_lit_complete
    urlConfig[0].topics[1].active = true // topic:places
    // @ts-ignore the object structure is checked manually
    urlConfig[1].topics[0].styles[0].filters[0].options[0].active = true // topic:fromTo filterOption-id:7

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
    // @ts-ignore the object structure is checked manually
    delete urlConfig[0].topics[2].styles[1] // topic:lit topic:landuse style removed
    // @ts-ignore the object structure is checked manually
    delete urlConfig[1].topics[0].styles[0].filters[0].options[0] // topic:fromTo topic:boundaries filterOption removed
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
    // @ts-ignore the object structure is checked manually
    urlConfig[0].topics[2].styles[0].id = 'now_removed_style' // topic:lit topic:landuse style:id changed
    // @ts-ignore the object structure is checked manually
    urlConfig[1].topics[0].styles[0].filters[0].options[0].id =
      'now_removed_option' // topic:fromTo topic:boundaries filterOption:id changed

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
