import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createMapRegionConfig } from './app/regionen/[regionSlug]/_components/mapStateConfig/createMapRegionConfig'
import { customStringify } from './app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParamParser/customParseStringify'
import { serializeMapParam } from './app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'
import { additionalRegionAttributes } from './regions/components/additionalRegionAttributes.const'

// Initialize /regionen/:slug with a `map` + `config` if none was given.
export function middleware(request: NextRequest) {
  const url = new URL(request.url)

  if (!url.searchParams.get('map') || !url.searchParams.get('config')) {
    // const region = useStaticRegion() // we cannot use this here, so we do it manually:
    const regionSlug = request.nextUrl.pathname.split('/').at(2)
    const region = additionalRegionAttributes.find((r) => r.slug === regionSlug)
    if (!region) return

    url.searchParams.append('map', serializeMapParam(region.map))

    const freshConfig = createMapRegionConfig(region.categories)
    url.searchParams.append('config', customStringify(freshConfig))
    return NextResponse.redirect(url.toString())
  }
}

// 'matcher' specifies on which routes the `middleware` runs
export const config = {
  matcher: ['/regionen/:path*'],
}
