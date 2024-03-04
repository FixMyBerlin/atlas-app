import adler32 from 'adler-32'
import { MapDataCategoryConfig } from '../type'

function isObject(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

const isArray = Array.isArray

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// sort keys of objects in a nested data structure of objects and arrays
// to make recursively iterating over it deterministic and deep comparison save
export function sortKeys(obj) {
  if (isArray(obj)) {
    return obj.map((v) => sortKeys(v))
  } else if (isObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj)
        .sort((a, b) => (a > b ? 1 : -1))
        .map(([k, v]) => [k, sortKeys(v)]),
    )
  } else {
    return obj
  }
}

// recursively iterates over a nested data structure of objects and arrays
// and calls fn(obj, path) for every object with properties 'id' and 'active'
export function iterate(obj, fn, path?) {
  if (!path) path = []
  if (isArray(obj)) {
    obj.forEach((v, i) => iterate(v, fn, [...path, i]))
  } else if (isObject(obj)) {
    if ('id' in obj && 'active' in obj) {
      fn(obj, path)
    }
    Object.entries(obj).forEach(([k, v]) => {
      iterate(v, fn, [...path, k])
    })
  }
}

export function generateConfigStructureAndChecksum(config: MapDataCategoryConfig) {
  config = deepCopy(config) as MapDataCategoryConfig
  iterate(config, (obj) => (obj.active = false))
  const checksum = new Uint32Array([adler32.str(JSON.stringify(config))])[0]!.toString(36) as string
  return [config as MapDataCategoryConfig, checksum]
}

const useBits = 31 // unsigned

export function encodeBits(booleans: boolean[]): number[] {
  const numIntegers = Math.ceil(booleans.length / useBits)
  const integers = new Array(numIntegers)
  for (let b = 0; b < booleans.length; b++) {
    const i = Math.floor(b / useBits)
    const bit = b % useBits
    integers[i] = integers[i] | (Number(booleans[b]) << bit)
  }
  return integers
}

export function decodeBits(integers: number[]) {
  const booleans: boolean[] = new Array(integers.length * useBits)
  for (let i = 0; i < integers.length; i++) {
    let int = integers[i]!
    for (let bit = 0; bit < useBits; bit++) {
      booleans[i * useBits + bit] = !!(int & 1)
      int >>= 1
    }
  }
  return booleans
}
