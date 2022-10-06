import { mapDataConfig } from '../../mapData'
import { flatMapFilterOptionData } from './flatMapFilterOptionData'

describe('flatMapFilterOptionData()', () => {
  it('works', () => {
    const flatFilterOptions = flatMapFilterOptionData(mapDataConfig.topics)
    let totalFilterOptions = 0
    mapDataConfig.topics.forEach((topic) => {
      topic.styles.forEach((style) => {
        style?.interactiveFilters?.forEach((filter) => {
          totalFilterOptions += filter.options.length || 0
        })
      })
    })
    expect(flatFilterOptions.length).toStrictEqual(totalFilterOptions)
    // just some random check to poke the data strucute
    // console.log(flatFilterOptions[0])
    expect(
      Object.keys(flatFilterOptions[0] || {}).includes('name')
    ).toStrictEqual(true)
  })
})
