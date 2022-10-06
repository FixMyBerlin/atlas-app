import { mapDataConfig } from '../../mapData'
import { flatMapStyleData } from './flatMapStyleData'

describe('flatMapStyleData()', () => {
  it('works', () => {
    const flatStyles = flatMapStyleData(mapDataConfig.topics)
    const totalStyles = mapDataConfig.topics.reduce(
      (prevSum, currVal) => prevSum + currVal.styles.length,
      0
    )
    expect(flatStyles.length).toStrictEqual(totalStyles)
    // just some random check to poke the data strucute
    // console.log(flatStyles[0])
    expect(Object.keys(flatStyles[0]).includes('layers')).toStrictEqual(true)

    // Note: we could/should check if `interactiveStyles` is deleted properly, but that was too tedious
  })
})
