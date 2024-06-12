import { MapDataCategoryConfig } from '../type'
import { iterate, decodeBits } from './lib'

// TODO: check checksum
export const parse = (
  searchParam: string,
  freshConfig: MapDataCategoryConfig[],
): MapDataCategoryConfig[] => {
  // TODO: tmp remove
  if (searchParam.startsWith('!')) {
    return structuredClone(freshConfig)
  }
  const base36 = searchParam.split('.').slice(1)
  const uint32s = base36.map((s) => Number.parseInt(s, 36))
  const actives = decodeBits(uint32s)
  const config = structuredClone(freshConfig)
  let i = 0
  iterate(config, (obj) => (obj.active = actives[i++]!))
  return config
}
