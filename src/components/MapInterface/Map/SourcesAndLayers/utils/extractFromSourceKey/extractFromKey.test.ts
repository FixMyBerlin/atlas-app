import { createSourceKey } from '@components/MapInterface/utils'
import { describe, expect, test } from 'vitest'
import { extractTopicIdFromSourceKey } from './extractFromKey'

describe('extractTopicIdFromSourceKey()', () => {
  test('work when used with the right input', () => {
    const input = createSourceKey('fooTheme', 'fooTopic', 'fooLayer')
    const result = extractTopicIdFromSourceKey(input)
    expect(result).toMatch('fooTopic')
  })
})
