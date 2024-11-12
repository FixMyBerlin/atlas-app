import { warnDev } from '@/src/dev'
import { migrations } from './migrations'

const currentVersion = Math.max(...Object.keys(migrations).map((key) => Number(key)))

function getVersion(searchParams: URLSearchParams) {
  const v = searchParams.get('v')
  if (v === null) return 0
  const version = Number(v)
  if (isNaN(version) || version < 0 || version > currentVersion) {
    warnDev(`Invalid searchParams version ${v}`)
    return null
  }
  return version
}

export const migrateSearchParams = (searchParams: URLSearchParams, region: any) => {
  const searchParamsVersion = getVersion(searchParams)
  if (searchParamsVersion === null) return false
  try {
    for (let v = searchParamsVersion + 1; v <= currentVersion; v++) {
      const migrate = migrations[v]
      if (!migrate) throw new Error(`Migration ${v} is missing.`)
      migrations[v](searchParams, region)
    }
    searchParams.set('v', String(currentVersion))
    return true
  } catch (e) {
    warnDev('Migration error:', e)
    return false
  }
}
