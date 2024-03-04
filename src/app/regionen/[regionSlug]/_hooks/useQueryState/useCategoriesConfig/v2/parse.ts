import { MapDataCategoryConfig } from '../type'
import { configStructures } from './configStructures'
import { iterate, decodeBits } from './lib'
import { errorDev } from 'src/dev'

export const parse = (searchParam: string): MapDataCategoryConfig | null => {
  try {
    const [checksum, ...base36] = searchParam.split('.')
    if (!checksum || !(checksum in configStructures)) {
      throw new Error(`Config structure with checksum '${checksum}' is missing.`)
    }
    const uint32s = base36.map((s) => Number.parseInt(s, 36));
    const actives = decodeBits(uint32s);
    const config = configStructures[checksum];
    let i = 0;
    iterate(config, (obj) => (obj.active = actives[i++]))
    return config
  } catch (e) {
    errorDev(e)
    return null
  }
}
