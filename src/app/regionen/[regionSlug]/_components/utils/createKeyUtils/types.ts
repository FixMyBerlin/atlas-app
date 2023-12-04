import {
  SubcategoryIds,
  SubcategoryStyleIds,
  SubcatStyleLegendIds,
} from '../../../_mapData/mapData.const'

// These Types holds a combination of all Subcat>Styles, even those that are not actually there.
// In other words: The Style part doe not know about the hierarchy of the Subcat part.
export type SubcatStyleKey = `${SubcategoryIds}-${SubcategoryStyleIds}`

export type SubcatStyleLegendKey = `${SubcatStyleKey}-${SubcatStyleLegendIds}`
