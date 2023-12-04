import { LegendId, StyleId, SubcategoryId } from '../../../_mapData/typeId'

// These Types holds a combination of all Subcat>Styles, even those that are not actually there.
// In other words: The Style part doe not know about the hierarchy of the Subcat part.
export type SubcatStyleKey = `${SubcategoryId}-${StyleId}`

export type SubcatStyleLegendKey = `${SubcatStyleKey}-${LegendId}`
