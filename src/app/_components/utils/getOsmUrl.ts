import { MapDataSourceInspectorEditor } from 'src/app/regionen/[regionSlug]/_mapData/types'
import { envKey } from './isEnv'

const osmUrls = {
  development: new URL(process.env.NEXT_PUBLIC_OSM_API_URL).origin,
  staging: new URL(process.env.NEXT_PUBLIC_OSM_API_URL).origin,
  production: 'https://www.openstreetmap.org',
}

export const getOsmUrl = (path?: string) => {
  const base = osmUrls[envKey]

  return (path ? `${base}${path}` : base) as MapDataSourceInspectorEditor['urlTemplate']
}

export const getOsmApiUrl = (path?: string) => {
  const base = process.env.NEXT_PUBLIC_OSM_API_URL

  return (path ? `${base}${path}` : base) satisfies MapDataSourceInspectorEditor['urlTemplate']
}
