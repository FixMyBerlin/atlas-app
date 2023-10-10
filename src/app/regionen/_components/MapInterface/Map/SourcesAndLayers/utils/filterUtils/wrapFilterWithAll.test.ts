'use client'

import { describe, expect, test } from 'vitest'
import { wrapFilterWithAll } from './wrapFilterWithAll'

describe('wrapFilterWithAll()', () => {
  test('"undefined" input returns an empty "all" wrapper', () => {
    const filterArray = undefined
    const result = wrapFilterWithAll(filterArray)
    expect(result).toMatchObject(['all'])
  })

  test('input with all returns the same input', () => {
    const filterArray = ['all', ['==', 'id', 'none'], ['==', 'is_pano', !0]]
    const result = wrapFilterWithAll(filterArray)
    expect(result).toMatchObject(filterArray)
  })

  test('one filter get wrapped with all', () => {
    const filter = ['==', 'id', 'none']
    const result = wrapFilterWithAll(filter)
    expect(result).toMatchObject(['all', filter])
  })

  test('multiple filter get wrapped with all', () => {
    const filter1 = ['==', 'id', 'none']
    const filter2 = ['==', 'is_pano', !0]
    const filterArray = [filter1, filter2]
    const result = wrapFilterWithAll(filterArray)
    expect(result).toMatchObject(['all', filter1, filter2])
  })
})
