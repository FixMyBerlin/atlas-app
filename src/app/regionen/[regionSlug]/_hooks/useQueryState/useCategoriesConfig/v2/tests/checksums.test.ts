import { describe, expect, test } from 'vitest'
import { configs } from '../configs'
import { getSimplifiedConfigs } from '../lib'

describe('Check if configs were changed', () => {
  test('Validate that the current config is stored. Run `npm run save-configs` if this fails.', () => {
    // This test fails if the config was changed.
    // Which means you need to run `npm run save-configs` to preserve this config as a template.
    // See [README.md](../../README.md) for more.
    const existingChecksums = Object.keys(configs)
    const currentChecksums = Object.keys(getSimplifiedConfigs())
    for (const checksum of currentChecksums) {
      expect(existingChecksums).toContain(checksum)
    }
  })
})
