type PointOrBbox =
  | {
      point: [number, number]
      bbox?: never
    }
  | {
      point?: never
      bbox: [number, number, number, number]
    }

export type UrlFeature = {
  sourceId: string
  properties: { id: number } | { osm_id: number; osm_type: string }
} & PointOrBbox

export type SourceInfo = {
  id: string
  type: 'osm' | 'mapillary'
  internal: boolean
  table: string | null
}
