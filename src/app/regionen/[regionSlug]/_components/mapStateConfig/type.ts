import { SubcategoryIds, SubcategoryStyleIds } from '../mapData/mapData.const'
import { MapDataCategoryIds } from '../mapData/mapDataCategories/categories.const'

export type CategoryConfig = {
  id: MapDataCategoryIds
  active: boolean
  subcategories: SubcategoryConfig[]
}

export type SubcategoryConfig = {
  id: SubcategoryIds
  styles: {
    id: SubcategoryStyleIds
    active: boolean
  }[]
}
