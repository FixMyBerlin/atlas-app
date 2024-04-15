import { MapDataCategoryId } from '../../_mapData/mapDataCategories/categories.const'
import { SourcesId } from '../../_mapData/mapDataSources/sources.const'
import { SubcategoryId } from '../../_mapData/typeId'

export type OsmType = 'N' | 'W' | 'R'

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

export type ParsedFeatureSource = {
  categoryId: MapDataCategoryId
  sourceId: SourcesId
  subcategoryId: SubcategoryId
}

export type SourceInfo = {
  id: string
  type: 'osm' | 'mapillary'
  internal: boolean
  table: string | null
}
