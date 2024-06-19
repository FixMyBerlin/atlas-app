import { describe, expect, test } from 'vitest'
import { configs } from '../configs'
import { getSimplifiedConfigs } from '../lib'

describe('Check if configs were changed', () => {
  test('Compare checksums current configs with previous configs.', () => {
    // this test fails if a config was changed and means that one or more
    // configs need to be saved because they might be needed in the future
    // just run `npm run save-configs`
    const existingChecksums = Object.keys(configs)
    const currentChecksums = Object.keys(getSimplifiedConfigs())
    for (const checksum of currentChecksums) {
      expect(existingChecksums).toContain(checksum)
    }
  })
})
