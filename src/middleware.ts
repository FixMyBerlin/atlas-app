import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createMapRegionConfig } from './app/regionen/[regionSlug]/_components/mapStateConfig/createMapRegionConfig'
import { configCustomStringify } from './app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParamParser/configCustomParser'
import { serializeMapParam } from './app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'
import { additionalRegionAttributes } from './regions/components/additionalRegionAttributes.const'

// Initialize /regionen/:slug with a `map` + `config` if none was given.
export function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const paths = request.nextUrl.pathname.split('/')
  const regionenSlugs = additionalRegionAttributes.map((r) => r.slug)

  // Guard: Only when params `map` or `config` are missing
  if (url.searchParams.get('map') && url.searchParams.get('config')) return
  // Guard: Only on path /regionen/<validSlug>
  if (paths[1] !== 'regionen') return
  if (paths[2] && !regionenSlugs.includes(paths[2])) return
  // Guard: Skip sub pages like /regionen/slug/foo
  if (paths.length !== 3) return

  // const region = useStaticRegion() // we cannot use this here, so we do it manually:
  const regionSlug = request.nextUrl.pathname.split('/').at(2)
  const region = additionalRegionAttributes.find((r) => r.slug === regionSlug)
  if (!region) return

  url.searchParams.append('map', serializeMapParam(region.map))

  const freshConfig = createMapRegionConfig(region.categories)
  url.searchParams.append('config', configCustomStringify(freshConfig))
  return NextResponse.redirect(url.toString())
}

// 'matcher' specifies on which routes the `middleware` runs
export const config = {
  matcher: ['/regionen/:path*'],
}
