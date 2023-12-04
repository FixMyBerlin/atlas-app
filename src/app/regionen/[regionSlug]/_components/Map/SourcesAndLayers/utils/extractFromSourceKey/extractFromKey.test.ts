import { describe, expect, test } from 'vitest'
import { createSourceKey } from '../../../../utils/createKeyUtils/createKeyUtils'
import { extractSubcatIdFromSourceKey } from './extractFromKey'

describe('extractSubcatIdFromSourceKey()', () => {
  test('work when used with the right input', () => {
    const input = createSourceKey('fooCategory', 'fooSource', 'fooSubcategory')
    const result = extractSubcatIdFromSourceKey(input)
    expect(result).toMatch('fooSubcategory')
  })
})
