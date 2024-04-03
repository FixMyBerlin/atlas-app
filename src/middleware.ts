import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { RegionSlug, staticRegion } from './app/regionen/(index)/_data/regions.const'
import { createFreshCategoriesConfig } from './app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/createFreshCategoriesConfig'
import { configCustomParse } from './app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/parser/configCustomParse'
import { configCustomStringify } from './app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/parser/configCustomStringify'
import {
  mapParamFallback,
  serializeMapParam,
} from './app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'
import { migrateUrl } from './app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/migrateUrl'
import { isDev } from './app/_components/utils/isEnv'

// 'matcher' specifies on which routes the `middleware` runs
export const config = {
  matcher: ['/regionen/:path*'],
}

export function middleware(request: NextRequest) {
  const initialUrl = request.url.toString()

  // Guard: Only on path /regionen/*
  const [_, page, regionSlug, sub] = new URL(initialUrl).pathname.split('/')
  if (page !== 'regionen' || regionSlug === undefined) {
    return NextResponse.next()
  }

  // Migrate URL
  let migratedUrl = migrateUrl(initialUrl)

  // Remove unused params
  const usedParams = ['map', 'config', 'v']
  const urlx = new URL(migratedUrl)
  Array.from(urlx.searchParams.keys()).forEach((key) => {
    !usedParams.includes(key) && urlx.searchParams.delete(key)
  })

  // TODO: Make sure param "map" is valid
  // if (mapParamIsNotValid) {
  //   url.searchParams.set('map', validMapParam)
  // }

  // TODO: Make sure param "config" is valid
  // if (configParamIsNotValid) {
  //   url.searchParams.set('config', validConfigParam)
  // }

  migratedUrl = urlx.toString()

  if (migratedUrl === initialUrl) {
    return NextResponse.next()
  } else {
    return NextResponse.redirect(migratedUrl, 301)
  }
}
