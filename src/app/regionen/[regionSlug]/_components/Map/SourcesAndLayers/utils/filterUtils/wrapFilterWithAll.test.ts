import { describe, expect, test } from 'vitest'
import { wrapFilterWithAll } from './wrapFilterWithAll'

describe('wrapFilterWithAll()', () => {
  test('"undefined" input returns an empty "all" wrapper', () => {
    const filterArray = undefined
    const result = wrapFilterWithAll(filterArray)
    expect(result).toMatchObject(['all'])
  })

  test('input with all returns the same input (including null guard)', () => {
    const filter1 = ['==', 'id', 'none']
    const filter2 = ['==', 'is_pano', !0]
    const filterArray = ['all', filter1, filter2, null, undefined]
    const result = wrapFilterWithAll(filterArray)
    expect(result).toMatchObject(['all', filter1, filter2])
  })

  test('multiple filter get wrapped with all (including null guard)', () => {
    const filter1 = ['==', 'id', 'none']
    const filter2 = ['==', 'is_pano', !0]
    const filterArray = [filter1, filter2, null, undefined]
    const result = wrapFilterWithAll(filterArray)
    expect(result).toMatchObject(['all', filter1, filter2])
  })

  test('one filter get wrapped with all', () => {
    const filter = ['==', 'id', 'none']
    const result = wrapFilterWithAll(filter)
    expect(result).toMatchObject(['all', filter])
  })

  test('input starts with null', () => {
    const filter = ['==', 'id', 'none']
    const result = wrapFilterWithAll([null, filter])
    expect(result).toMatchObject(['all', filter])
  })

  test('input empty array', () => {
    const filter = []
    const result = wrapFilterWithAll(filter)
    expect(result).toMatchObject(['all'])
  })

  test('allow nested alls', () => {
    const expression = ['==', 'id', 1]
    const filter = ['all', expression]
    const result = wrapFilterWithAll([expression, filter])
    expect(result).toMatchObject(['all', expression, filter])
  })

  test('cleanup multipe "all"s', () => {
    const expression = ['==', 'id', 1]
    const filter = ['all', expression]
    const result = wrapFilterWithAll([expression, 'all', expression])
    expect(result).toMatchObject(['all', expression, expression])
  })
})
