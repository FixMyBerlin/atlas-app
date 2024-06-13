import { describe, expect, test } from 'vitest'
import { checksums as previousChecksums } from './checksums'
import { generateChecksums } from './generateChecksums'

describe('Check if configs were changed', () => {
  test('Compare checksums current configs with previous configs.', () => {
    const currentChecksums = generateChecksums()
    expect(previousChecksums).toMatchObject(currentChecksums)
    expect(currentChecksums).toMatchObject(previousChecksums)
  })
})
