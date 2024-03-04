import { MapDataCategoryConfig } from '../type'
import { configStructures } from './configStructures'
import { isDev } from 'src/app/_components/utils/isEnv'
import { sortKeys, iterate, generateConfigStructureAndChecksum, encodeBits } from './lib'

export const serialize = (config: MapDataCategoryConfig) => {
  config = sortKeys(config)
  const [configStructure, checksum] = generateConfigStructureAndChecksum(config)
  // @ts-ignore
  if (!(checksum in configStructures) && isDev) {
    console.warn(`
Current structure of config needs to be saved in parser/v2/configStructures.ts
key: ${checksum}
value: ${JSON.stringify(configStructure).slice(0, 100)}
`)
  }
  const actives: boolean[] = []
  iterate(config, (obj) => actives.push(obj.active))
  const encoded = encodeBits(actives)
  return [checksum, ...encoded.map((v) => v.toString(36))].join('.')
}
