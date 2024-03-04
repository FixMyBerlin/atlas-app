import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { staticRegion } from './app/regionen/(index)/_data/regions.const'
import { createFreshCategoriesConfig } from './app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/createFreshCategoriesConfig'
import { configCustomParse } from './app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/parser/configCustomParse'
import { configCustomStringify } from './app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/parser/configCustomStringify'
import {
  mapParamFallback,
  serializeMapParam,
} from './app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'

// 'matcher' specifies on which routes the `middleware` runs
export const config = {
  matcher: ['/regionen/:path*'],
}

export function middleware(request: NextRequest) {
  const doNothing = NextResponse.next()
  let performRedirect = false

  const url = new URL(request.url)

  // Guard: Only on path /regionen/<validSlug>
  const paths = request.nextUrl.pathname.split('/')
  const regionenSlugs = staticRegion.map((r) => r.slug)
  if (paths[1] !== 'regionen') return doNothing
  if (paths[2] && !regionenSlugs.includes(paths[2])) return doNothing
  if (paths.length !== 3) return doNothing // Skip sub pages like /regionen/slug/foo

  // MIGRATION: Remove legacy `theme` param
  if (url.searchParams.get('theme')) {
    url.searchParams.delete('theme')
    performRedirect = true
  }

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
    performRedirect = true
  }

  // INITIALIZATION: Make sure every map has a `map` and `config` param
  const regionSlug = request.nextUrl.pathname.split('/').at(2) // We cannot use `useStaticRegion` here, so we do it manually
  const region = staticRegion.find((r) => r.slug === regionSlug)
  if (!region) return doNothing

  if (!url.searchParams.get('map')) {
    url.searchParams.append('map', serializeMapParam(region.map))
    performRedirect = true
  }

  const freshConfig = createFreshCategoriesConfig(region.categories)
  const migratedConfig = configCustomStringify(
    configCustomParse(url.searchParams.get('config'), freshConfig),
  )
  url.searchParams.delete('config')
  url.searchParams.append('config', migratedConfig)
  if (url.searchParams.get('config') !== migratedConfig) {
    performRedirect = true
  }

  if (performRedirect) {
    return NextResponse.redirect(url.toString(), 301)
  }

  return doNothing
}
