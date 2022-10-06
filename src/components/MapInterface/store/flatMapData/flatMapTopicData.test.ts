import { mapDataConfig } from '../../mapData'
import { flatMapTopicData } from './flatMapTopicData'

describe('flatMapTopicData()', () => {
  it('works', () => {
    const flatTopics = flatMapTopicData(mapDataConfig.topics)
    expect(flatTopics.length).toStrictEqual(mapDataConfig.topics.length)
    expect(Object.keys(flatTopics[0]).includes('id')).toStrictEqual(true)
  })
})
