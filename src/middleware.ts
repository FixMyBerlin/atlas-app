import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { migrateUrl } from './app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/migrateUrl'
import { staticRegion } from './app/regionen/(index)/_data/regions.const'

// 'matcher' specifies on which routes the `middleware` runs
export const config = {
  matcher: ['/regionen/:path*'],
}

function splitPathname(url) {
  return new URL(url).pathname.slice(1).split('/')
}

function redirectIfChanged(oldUrl, newUrl) {
  if (oldUrl === newUrl) {
    return NextResponse.next()
  } else {
    return NextResponse.redirect(newUrl, 301)
  }
}

function renameRegionIfNecessary(url: string) {
  const slug = splitPathname(url)[1]!
  const renamedRegions = {
    // [oldName, newName]
    // Remember to also add a migration like db/migrations/20240307091010_migrate_region_slugs/migration.sql
    'bb-ag': 'bb-pg',
    'bb-ramboll': 'bb-sg',
  }
  const newSlug = renamedRegions[slug]
  if (newSlug) {
    const u = new URL(url)
    u.pathname = u.pathname.replace(slug, newSlug)
    return u.toString()
  } else {
    return url
  }
}

export function middleware(request: NextRequest) {
  const initialUrl = request.url.toString()

  let [page, slug, subpage] = splitPathname(initialUrl)
  if (page !== 'regionen') return NextResponse.next()
  if (page === 'regionen' && !slug) return NextResponse.next()
  // from here path must be '/regionen/[slug]...'

  let migratedUrl = renameRegionIfNecessary(initialUrl)
  // from here slugs were renamed

  const existingSlugs = staticRegion.map((r) => r.slug)
  slug = splitPathname(migratedUrl)[1]
  if (!existingSlugs.includes(slug!)) return NextResponse.next()
  // from here we're sure that the region exists

  if (subpage) return redirectIfChanged(initialUrl, migratedUrl)
  // from here we know that it's not a subpage and therefor should have search params

  // Migrate URL
  migratedUrl = migrateUrl(migratedUrl)

  // Remove unused params
  const usedParams = ['map', 'config', 'v']
  const u = new URL(migratedUrl)
  Array.from(u.searchParams.keys()).forEach((key) => {
    !usedParams.includes(key) && u.searchParams.delete(key)
  })

  // TODO: Make sure param "map" is valid
  // if (mapParamIsNotValid) {
  //   url.searchParams.set('map', validMapParam)
  // }

  // TODO: Make sure param "config" is valid
  // if (configParamIsNotValid) {
  //   url.searchParams.set('config', validConfigParam)
  // }

  migratedUrl = u.toString()

  return redirectIfChanged(initialUrl, migratedUrl)
}
