import { describe, expect, test } from 'vitest'
import { createSourceKey } from '../../../../utils/createKeyUtils/createKeyUtils'
import { extractTopicIdFromSourceKey } from './extractFromKey'

describe('extractTopicIdFromSourceKey()', () => {
  test('work when used with the right input', () => {
    const input = createSourceKey('fooTheme', 'fooSource', 'fooTopic')
    const result = extractTopicIdFromSourceKey(input)
    expect(result).toMatch('fooTopic')
  })
})
