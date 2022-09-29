import { mapDataConfig } from '../../Map/mapData'
import { flatMapFilterData } from './flatMapFilterData'

describe('flatMapFilterData()', () => {
  it('works', () => {
    const flatFilters = flatMapFilterData(mapDataConfig.topics)
    let totalFilters = 0
    mapDataConfig.topics.forEach((topic) => {
      topic.styles.forEach((style) => {
        totalFilters += style?.interactiveFilters?.length || 0
      })
    })
    expect(flatFilters.length).toStrictEqual(totalFilters)
    // just some random check to poke the data strucute
    // console.log(flatFilters[0])
    expect(Object.keys(flatFilters[0]).includes('inputType')).toStrictEqual(
      true
    )
    // Note: we could/should check if `interactiveStyles` is deleted properly, but that was too tedious
  })
})
