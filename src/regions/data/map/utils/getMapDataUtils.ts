import invariant from 'tiny-invariant'
import { MapDataCategoryIds, categories } from '../categoryData.const'
import { SourcesDatasetsIds, sourcesDatasets } from '../datasets/sourcesDatasets.const'
import { SubcategoryIds, SubcategoryStyleIds } from '../subcategories/types'
import { SourcesIds, categorySources } from '../sources/categorySources.const'
import { subcat_accidents } from '../subcategories/subcat_accidents.const'
import { subcat_barriers } from '../subcategories/subcat_barriers.const'
import { subcat_bicycleParking } from '../subcategories/subcat_bicycleParking'
import { subcat_bikelanes } from '../subcategories/subcat_bikelanes.const'
import { subcat_bikelanesPresence } from '../subcategories/subcat_bikelanesPresence.const'
import { subcat_bikelanesPresence_legacy } from '../subcategories/subcat_bikelanesPresence_legacy.const'
import { subcat_bikelanesSurface } from '../subcategories/subcat_bikelanesSurface.const'
import { subcat_boundaries } from '../subcategories/subcat_boundaries.const'
import { subcat_buildings } from '../subcategories/subcat_buildings.const'
import { subcat_education } from '../subcategories/subcat_education.const'
import { subcat_landuse } from '../subcategories/subcat_landuse.const'
import { subcat_lit } from '../subcategories/subcat_lit.const'
import { subcat_lit_legacy } from '../subcategories/subcat_lit_legacy.const'
import { subcat_mapillaryCoverage } from '../subcategories/subcat_mapillaryCoverage.const'
import { subcat_maxspeed } from '../subcategories/subcat_maxspeed.const'
import { subcat_maxspeed_legacy } from '../subcategories/subcat_maxspeed_legacy.const'
import { subcat_parking } from '../subcategories/subcat_parking.const'
import { subcat_parkingAreas } from '../subcategories/subcat_parkingAreas.const'
import { subcat_parkingDebug } from '../subcategories/subcat_parkingDebug.const'
import { subcat_parkingPoints } from '../subcategories/subcat_parkingPoints.const'
import { subcat_parkingStats } from '../subcategories/subcat_parkingStats.const'
import { subcat_places } from '../subcategories/subcat_places.const'
import { subcat_poi } from '../subcategories/subcat_poi.const'
import { subcat_publicTransport } from '../subcategories/subcat_publicTransport.const'
import { subcat_roads } from '../subcategories/subcat_roads.const'
import { subcat_roadsSurface } from '../subcategories/subcat_roadsSurface.const'
import { subcat_roadsSurface_legacy } from '../subcategories/subcat_roadsSurface_legacy.const'
import { subcat_roads_legacy } from '../subcategories/subcat_roads_legacy.const'
import { subcat_signs } from '../subcategories/subcat_signs.const'
import { MapData, MapDataSubcat } from '../types'

export const getCategoryData = (categoryId: MapDataCategoryIds | undefined) => {
  const categoryData = categories.find((the) => the.id === categoryId)
  invariant(categoryData, `getCategoryData: category data for ${categoryId} missing`)
  return categoryData
}

export const getSubcategoryData = (subcatId: SubcategoryIds | undefined) => {
  const subcatData = mapData?.subcategories.find((t) => t.id === subcatId)
  invariant(subcatData, `getSubcategoryData: subcategory data for ${subcatId} missing`)
  return subcatData
}

export const getStyleData = (
  subcatData: MapDataSubcat | undefined,
  styleId: SubcategoryStyleIds | undefined,
) => {
  const styleData = subcatData?.styles.find((s) => s.id === styleId)
  invariant(styleData, `getStyleData: styleData for ${styleId} missing`)
  return styleData
}

export const getSourceData = (sourceId: SourcesIds) => {
  const sourceData = mapData?.sources?.find((s) => s.id === sourceId)
  invariant(sourceData, `getSourceData: sourceData for ${sourceId} missing`)
  return sourceData
}

export const getDatasetOrSourceData = (sourceId: SourcesDatasetsIds | SourcesIds) => {
  const sourceData = mapData?.sources?.find((s) => s.id === sourceId)
  const datasetData = sourcesDatasets?.find((s) => s.id === sourceId)
  return sourceData || datasetData
}

const mapData: MapData = {
  sources: categorySources,
  subcategories: [
    subcat_accidents,
    subcat_barriers,
    subcat_bicycleParking,
    subcat_bikelanes,
    subcat_bikelanesPresence_legacy,
    subcat_bikelanesPresence,
    subcat_bikelanesSurface,
    subcat_boundaries,
    subcat_buildings,
    subcat_education,
    subcat_landuse,
    subcat_lit_legacy,
    subcat_lit,
    subcat_mapillaryCoverage,
    subcat_maxspeed_legacy,
    subcat_maxspeed,
    subcat_parking,
    subcat_parkingAreas,
    subcat_parkingDebug,
    subcat_parkingPoints,
    subcat_parkingStats,
    subcat_places,
    subcat_poi,
    subcat_publicTransport,
    subcat_roads_legacy,
    subcat_roads,
    subcat_roadsSurface_legacy,
    subcat_roadsSurface,
    subcat_signs,
  ],
}
