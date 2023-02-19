import { describe, expect, test } from 'vitest'
import { minimizeObjectKeys } from './minimzeObjectKeys'

describe('minimizeObjectKeys()', () => {
  test('ignores strings', () => {
    const input = 'foo'
    const result = minimizeObjectKeys(input)
    expect(result).toMatchObject(input)
  })
  test('ignores array', () => {
    const input = ['foo']
    const result = minimizeObjectKeys(input)
    expect(result).toMatchObject(input)
  })
  test('ignores boolean', () => {
    const input = true
    const result = minimizeObjectKeys(input)
    expect(result).toMatchObject(input)
  })
  test('ignores null', () => {
    const input = null
    const result = minimizeObjectKeys(input)
    // @ts-ignore no idea why TS complains about the type match here, function returns types as expeced
    expect(result).toMatchObject(input)
  })
  test('ignores undefined', () => {
    const input = undefined
    const result = minimizeObjectKeys(input)
    // @ts-ignore no idea why TS complains about the type match here, function returns types as expeced
    expect(result).toMatchObject(input)
  })
  test('ignores number', () => {
    const input = 1
    const result = minimizeObjectKeys(input)
    expect(result).toMatchObject(input)
  })

  test('handles nested object, minimizes all key', () => {
    const input = {
      id: 'foo1',
      active: true,
      style: { id: 's1', active: false },
      default: false,
      options: { id: 'o2', default: true },
      type: 'Feature',
      properties: [],
      geometry: {
        coordinate: [
          [1, 2],
          [1, 2],
        ],
      },
    }
    const output = {
      i: 'foo1',
      a: true,
      s: { i: 's1', a: false },
      d: false,
      o: { i: 'o2', d: true },
      t: 'Feature',
      p: [],
      g: {
        c: [
          [1, 2],
          [1, 2],
        ],
      },
    }
    const result = minimizeObjectKeys(input)
    expect(result).toMatchObject(output)
  })
})
