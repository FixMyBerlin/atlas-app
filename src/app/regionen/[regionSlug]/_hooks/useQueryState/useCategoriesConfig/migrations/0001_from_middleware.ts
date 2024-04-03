import { UrlMigration } from './types'
import { RegionSlug, staticRegion } from 'src/app/regionen/(index)/_data/regions.const'
import { mapParamFallback, serializeMapParam } from '../../useMapParam'
import { createFreshCategoriesConfig } from '../createFreshCategoriesConfig'
import { configCustomStringify } from '../parser/configCustomStringify'
import { configCustomParse } from '../parser/configCustomParse'

const migration: UrlMigration = function (initialUrl) {
  const url = new URL(initialUrl)

  const paths = url.pathname.split('/')
  let possiblyRegionSlug = paths[2]

  // MIGRATION: Migrate renamed region names
  const renamedRegions = new Map<string, RegionSlug>([
    // [oldName, newName]
    // Remember to also add a migration like db/migrations/20240307091010_migrate_region_slugs/migration.sql
    ['bb-ag', 'bb-pg'],
    ['bb-ramboll', 'bb-sg'],
  ])
  const redirectSlug = renamedRegions.get(possiblyRegionSlug || '')
  if (possiblyRegionSlug && redirectSlug) {
    url.pathname = url.pathname.replace(possiblyRegionSlug, redirectSlug)
    // Case 1: We are on `regions/oldSlug/subPage` in which case we want to redirect
    // but not apply all the map stuff below, so we exit early
    if (paths.length !== 3) {
      return url.toString()
    }
    // Case 1: We are on `regions/oldSlug` in which case we want to redirect
    // and also continue to apply all the map stuff below
    possiblyRegionSlug = redirectSlug
  }

  // Guard: Only on path /regionen/<validSlug>
  const regionenSlugs = staticRegion.map((r) => r.slug)
  if (possiblyRegionSlug && !regionenSlugs.includes(possiblyRegionSlug)) return initialUrl
  if (paths.length !== 3) return initialUrl // Skip sub pages like /regionen/slug/foo

  // MIGRATION: Rename old strings in `config` param
  // We do this migration on string level which makes it a lot easier
  // OLD => NEW
  const config = url.searchParams.get('config')
  if (config) {
    let newConfig = config
    const nameMigrations = {
      // Category names changes:
      // Note: `~a` postfix signals a category, `~s` postfix signals a subcategory, no will match both
      // (One is an array, one is an object, which corresponds to category and subcategory.)
      'i~fromTo~': 'i~poi~',
      'i~shops~': 'i~poi~',
      'i~roadClassification~': 'i~roads~',
      // Done in https://github.com/FixMyBerlin/atlas-app/commit/5541a6ac3f03e4276e65fa4334c90f3408a48de5
      'i~boundaries~s': 'i~poiBoundaries~s',
      'i~barriers~s': 'i~poiPlusBarriers~s',
      'i~landuse~s': 'i~poiPlusLanduse~s',
      'i~publicTransport~s': 'i~poiPlusPublicTransport~s',
      // Done in https://github.com/FixMyBerlin/atlas-app/commit/7f8f987b1e4927f79fe7c4f7f7f09f2c54d0781e
      'i~places~s': 'i~poiPlaces~s',
      // Property name changes:
      '~topics~': '~sc~',
    }
    for (const [old, updated] of Object.entries(nameMigrations)) {
      newConfig = newConfig.replaceAll(old, updated)
    }
    url.searchParams.set('config', newConfig)
  }

  // MIGRATION: Update `lat`/`lng`/`zoom` params to new `map` param
  // We either have all three or only lat/lng as input params
  const lat = url.searchParams.get('lat')
  const lng = url.searchParams.get('lng')
  const zoom = url.searchParams.get('zoom')
  if ((lat && lng && zoom) || (lat && lng)) {
    // Sometimes, we have a ?map but also ?lng, ?lat in which case we just delete the old stuff
    if (!url.searchParams.get('map')) {
      url.searchParams.append(
        'map',
        serializeMapParam({
          zoom: zoom ? Number(zoom) : mapParamFallback.zoom,
          lat: lat ? Number(lat) : mapParamFallback.lat,
          lng: lng ? Number(lng) : mapParamFallback.lng,
        }),
      )
    }
    url.searchParams.delete('lat')
    url.searchParams.delete('lng')
    url.searchParams.delete('zoom')
  }

  // INITIALIZATION: Make sure every map has a `map` and `config` param
  // We cannot use `useStaticRegion` here, so we do it manually
  const region = staticRegion.find((r) => r.slug === possiblyRegionSlug)
  if (!region) return initialUrl

  if (!url.searchParams.get('map')) {
    url.searchParams.append('map', serializeMapParam(region.map))
  }

  const freshConfig = createFreshCategoriesConfig(region.categories)
  const migratedConfig = configCustomStringify(
    configCustomParse(url.searchParams.get('config'), freshConfig),
  )
  url.searchParams.delete('config')
  url.searchParams.append('config', migratedConfig)

  return url.toString()
}

export default migration
