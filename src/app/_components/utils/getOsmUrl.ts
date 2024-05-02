import { MapDataSourceInspectorEditor } from 'src/app/regionen/[regionSlug]/_mapData/types'

export const getOsmUrl = (path?: string) => {
  const origin = new URL(process.env.NEXT_PUBLIC_OSM_API_URL).origin

  return (path ? `${origin}${path}` : origin) as MapDataSourceInspectorEditor['urlTemplate']
}

export const getOsmApiUrl = (path?: string) => {
  const base = process.env.NEXT_PUBLIC_OSM_API_URL

  return (path ? `${base}${path}` : base) satisfies MapDataSourceInspectorEditor['urlTemplate']
}
