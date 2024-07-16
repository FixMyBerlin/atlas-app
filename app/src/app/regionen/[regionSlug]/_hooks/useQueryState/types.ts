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
