import { MapDataCategoryIds } from 'src/regions/data/map/categoryData.const'
import { SubcategoryIds, SubcategoryStyleIds } from 'src/regions/data/map/subcategories/types'

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
