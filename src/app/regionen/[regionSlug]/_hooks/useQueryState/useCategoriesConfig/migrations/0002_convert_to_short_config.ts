import { SearchParamsMigration } from './types'
import { expandObjectKeys } from '../parser/minimzeObjectKeys'
import { jsurlParse } from '../parser/jurlParseStringify'
import { serialize } from '../v2/serialize'

const migration: SearchParamsMigration = function (params, region) {
  let serializedConfig = params.get('config')
  if (!serializedConfig) return false
  let config = expandObjectKeys(jsurlParse(serializedConfig) as Record<string, any>)
  const migratedConfigSerialized = serialize(config)
  params.set('config', migratedConfigSerialized)
  return true
}

export default migration
