import adler32 from 'adler-32'
import { MapDataCategoryConfig } from '../type'
import { simplifyConfigForParams } from '../utils/simplifyConfigForParams'
import { staticRegion } from '../../../../../(index)/_data/regions.const'
import { createFreshCategoriesConfig } from '../createFreshCategoriesConfig'

function isObject(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

// recursively iterates over a nested data structure of objects and arrays
// and calls fn(obj, path) for every object with properties 'id' and 'active'
type Obj = Record<string, any> & { id: string; active: boolean }
type Fn = (obj: Obj, path: any[]) => void
export function iterate(obj, fn: Fn, path?) {
  if (!path) path = []
  if (Array.isArray(obj)) {
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

export function setAllActiveToFalse<T>(config: T) {
  const allActiveFalse = structuredClone(config)
  iterate(allActiveFalse, (obj) => (obj.active = false))
  return allActiveFalse
}

export function calcConfigChecksum(config: MapDataCategoryConfig[]) {
  const simplified = simplifyConfigForParams(config)
  const allFalse = setAllActiveToFalse(simplified)
  const checksum = new Uint32Array([adler32.str(JSON.stringify(allFalse))])[0]!.toString(36)
  return checksum
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

export function getSimplifiedConfigs() {
  return Object.fromEntries(
    staticRegion.map((region) => {
      const freshConfig = createFreshCategoriesConfig(region.categories)
      const simplifiedConfig = simplifyConfigForParams(freshConfig)
      const checksum = calcConfigChecksum(freshConfig)
      return [checksum, simplifiedConfig]
    }),
  )
}
