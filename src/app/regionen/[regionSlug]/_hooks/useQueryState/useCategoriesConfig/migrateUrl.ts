import { migrations } from './migrations'

const currentVersion = Math.max(...Object.keys(migrations).map((key) => Number(key)))

function getVersion(url: string) {
  const v = new URL(url).searchParams.get('v')
  if (v === null) return 0
  const version = Number(v)
  if (isNaN(version) || version < 0 || version > currentVersion) {
    throw new Error(`Invalid searchParams version ${v}`)
  }
  return version
}

export function migrateUrl(url: string): string {
  const searchParamsVersion = getVersion(url)
  let migratedUrl = url
  for (let v = searchParamsVersion + 1; v <= currentVersion; v++) {
    const migrate = migrations[v]
    if (!migrate) throw new Error(`Migration ${v} is missing.`)
    migratedUrl = migrations[v](migratedUrl)
  }
  const u = new URL(migratedUrl)
  u.searchParams.set('v', String(currentVersion))
  return u.toString()
}
