import { MapDataCategoryId } from '../../_mapData/mapDataCategories/categories.const'
import { SourcesId } from '../../_mapData/mapDataSources/sources.const'
import { SubcategoryId } from '../../_mapData/typeId'

export type UrlFeature = {
  sourceId: string
  properties: {
    id?: string | number
    osm_type?: 'N' | 'W' | 'R'
    osm_id?: number
  }
}

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
