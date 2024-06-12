import { MapDataCategoryConfig } from '../type'
import { iterate, encodeBits, calcConfigChecksum } from './lib'

export const serialize = (config: MapDataCategoryConfig[]) => {
  const checksum = calcConfigChecksum(config)
  const actives: boolean[] = []
  iterate(config, (obj) => actives.push(obj.active))
  const encoded = encodeBits(actives)
  const base36 = encoded.map((v) => v.toString(36))
  return [checksum, ...base36].join('.')
}
