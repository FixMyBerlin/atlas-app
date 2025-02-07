import { Prettify } from '@/src/app/_components/types/types'
import { MapDataCategoryId } from '../../../_mapData/mapDataCategories/MapDataCategoryId'
import { StyleId, SubcategoryId } from '../../../_mapData/typeId'
import { StaticMapDataCategory } from '../../../_mapData/types'

// ========
// Category config as URL params — what is returned by `stringify`/`serialize`
// ========

export type MapDataCategoryParam = {
  id: MapDataCategoryId
  active: boolean
  subcategories: MapDataSubcategoryParam[]
}

type MapDataSubcategoryParam = {
  id: SubcategoryId
  styles: {
    id: StyleId
    active: boolean
  }[]
}

// ========
// Category config als object — what is returned by `parse`
// ========

export type MapDataCategoryConfig = Prettify<
  Omit<StaticMapDataCategory, 'subcategories'> & {
    active: boolean
    // open: boolean // TODO: We will probably want to add this to handle to Disclosure open/close state separate from the active state.
    subcategories: MapDataSubcategoryConfig[]
  }
>

type MergeSubcategory = StaticMapDataCategory['subcategories'][number]
export type MapDataSubcategoryConfig = Prettify<
  Omit<MergeSubcategory, 'styles'> & {
    styles: MapDataSubcategoryStyleConfig[]
  }
>

type MergeStyle = StaticMapDataCategory['subcategories'][number]['styles'][number]
type MapDataSubcategoryStyleConfig = Prettify<
  MergeStyle & {
    active: boolean
  }
>
