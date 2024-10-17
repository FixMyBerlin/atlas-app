import { StaticRegion, staticRegion } from '@/src/app/regionen/(index)/_data/regions.const'
import { createFreshCategoriesConfig } from '../createFreshCategoriesConfig'
import { configCustomParse } from '../v1/configCustomParse'
import { serialize } from '../v2/serialize'
import { UrlMigration } from './types'

const migration: UrlMigration = function (initialUrl) {
  const u = new URL(initialUrl)

  const slug = u.pathname.split('/')[2] // we now that we get /regions/[slug] here
  console.assert(slug, 'no region slug.')

  const region = staticRegion.find((r) => r.slug === slug) as StaticRegion
  console.assert(region, `region ${slug} not found.`)

  const freshConfig = createFreshCategoriesConfig(region.categories)
  const config = configCustomParse(u.searchParams.get('config'), freshConfig)

  const migratedConfig = serialize(config)
  u.searchParams.set('config', migratedConfig)

  return u.toString()
}

export default migration
