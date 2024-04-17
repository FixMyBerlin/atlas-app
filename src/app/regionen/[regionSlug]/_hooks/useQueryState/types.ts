type PointOrBbox =
  | {
      coordinates: [number, number]
    }
  | {
      coordinates: [number, number, number, number]
    }

export type UrlFeature = {
  sourceId: string
  properties: { id: number }
} & PointOrBbox

export type SourceInfo = {
  id: string
  type: 'osm' | 'mapillary'
  internal: boolean
  table: string | null
}
