import { StaticRegion } from 'src/app/regionen/(index)/_data/regions.const'
import { SourceExportApiIdentifier } from '../../regionen/[regionSlug]/_mapData/mapDataSources/sources.const'
import { appBaseUrl } from './appBaseUrl.const'

export const getExportApiUrl = (
  regionSlug: string,
  apiIdentifier: SourceExportApiIdentifier,
  env?: typeof process.env.NEXT_PUBLIC_APP_ENV,
) => {
  env = env ?? process.env.NEXT_PUBLIC_APP_ENV
  const url = new URL(`${appBaseUrl[env]}/api/export/${regionSlug}/${apiIdentifier}`)

  return url.toString()
}

export const getExportApiBboxUrl = (
  regionSlug: string,
  apiIdentifier: SourceExportApiIdentifier,
  bbox: NonNullable<StaticRegion['bbox']>,
  env?: typeof process.env.NEXT_PUBLIC_APP_ENV,
) => {
  const url = new URL(getExportApiUrl(regionSlug, apiIdentifier, env))
  url.searchParams.append('minlon', String(bbox.min[0]))
  url.searchParams.append('minlat', String(bbox.min[1]))
  url.searchParams.append('maxlon', String(bbox.max[0]))
  url.searchParams.append('maxlat', String(bbox.max[1]))

  return url.toString()
}
