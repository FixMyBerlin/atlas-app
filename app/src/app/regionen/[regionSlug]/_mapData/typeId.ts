import {
  SubcatAccidentsId,
  SubcatAccidentsStyleIds,
} from './mapDataSubcategories/subcat_accidents.const'
import {
  SubcatBicycleParkingId,
  SubcatBicycleParkingStyleIds,
} from './mapDataSubcategories/subcat_bicycleParking'
import {
  SubcatBikelanesId,
  SubcatBikelanesStyleIds,
} from './mapDataSubcategories/subcat_bikelanes.const'
import {
  SubcatBikelanesStatsId,
  SubcatBikelanesStatsStyleIds,
} from './mapDataSubcategories/subcat_bikelanesStatistics.const'
import {
  SubcatBikelanesPlusBikeSuitabilityId,
  SubcatBikelanesPlusBikeSuitabilityStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_bikeSuitability'
import {
  SubcatBikelanesPlusPresenceId,
  SubcatBikelanesPlusPresenceStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_presence.const'
import {
  SubcatBikelanesPlusRoutesId,
  SubcatBikelanesPlusRoutesStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_routes.const'
import {
  SubcatBikelanesPlusSignsId,
  SubcatBikelanesPlusSignsStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_signs.const'
import {
  SubcatBikelanesPlusSurfaceId,
  SubcatBikelanesPlusSurfaceStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_surface_text.const'
import {
  SubcatBikelanesPlusVerificationId,
  SubcatBikelanesPlusVerificationStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_verification.const'
import {
  SubcatBikelanesPlusWidthTextId,
  SubcatBikelanesPlusWidthTextStyleIds,
} from './mapDataSubcategories/subcat_bikelanes_plus_width_text.const'
import { SubcatLitId, SubcatLitStyleIds } from './mapDataSubcategories/subcat_lit.const'
import {
  SubcatLitPlusCompletenessId,
  SubcatLitPlusCompletenessStyleIds,
} from './mapDataSubcategories/subcat_lit_plus_completeness.const'
import {
  SubcatLitPlusFreshnessId,
  SubcatLitPlusFreshnessStyleIds,
} from './mapDataSubcategories/subcat_lit_plus_freshness.const'
import {
  SubcatMapillaryCoverageId,
  SubcatMapillaryCoverageStyleIds,
} from './mapDataSubcategories/subcat_mapillaryCoverage.const'
import {
  SubcatMaxspeedId,
  SubcatMaxspeedStyleIds,
} from './mapDataSubcategories/subcat_maxspeed.const'
import {
  SubcatMaxspeedPlusPresenceId,
  SubcatMaxspeedPlusPresenceStyleIds,
} from './mapDataSubcategories/subcat_maxspeed_plus_presence'
import { SubcatParkingId, SubcatParkingStyleIds } from './mapDataSubcategories/subcat_parking.const'
import {
  SubcatParkingAreasId,
  SubcatParkingAreasStyleIds,
} from './mapDataSubcategories/subcat_parkingAreas.const'
import {
  SubcatParkingBoundariesId,
  SubcatParkingBoundariesStyleIds,
} from './mapDataSubcategories/subcat_parkingBoundaries.const'
import {
  SubcatParkingDebugId,
  SubcatParkingDebugStyleIds,
} from './mapDataSubcategories/subcat_parkingDebug.const'
import {
  SubcatParkingPointsId,
  SubcatParkingPointsStyleIds,
} from './mapDataSubcategories/subcat_parkingPoints.const'
import {
  SubcatParkingStatsId,
  SubcatParkingStatsStyleIds,
} from './mapDataSubcategories/subcat_parkingStats.const'
import { SubcatPoiId, SubcatPoiStyleIds } from './mapDataSubcategories/subcat_poi.const'
import {
  SubcatPoiBoundariesId,
  SubcatPoiBoundariesStyleIds,
} from './mapDataSubcategories/subcat_poi_boundaries.const'
import {
  SubcatPoiPlacesId,
  SubcatPoiPlacesStyleIds,
} from './mapDataSubcategories/subcat_poi_places.const'
import {
  SubcatPoiPlusBarriersId,
  SubcatPoiPlusBarriersStyleIds,
} from './mapDataSubcategories/subcat_poi_plus_barriers.const'
import {
  SubcatPoiPlusLanduseId,
  SubcatPoiPlusLanduseStyleIds,
} from './mapDataSubcategories/subcat_poi_plus_landuse.const'
import {
  SubcatPoiPlusPublicTransportId,
  SubcatPoiPlusPublicTransportStyleIds,
} from './mapDataSubcategories/subcat_poi_plus_publicTransport.const'
import {
  SubcatRadinfraCampaignId,
  SubcatRadinfraCampaignStyleIds,
} from './mapDataSubcategories/subcat_radinfra_campaigns.const'
import {
  SubcatRadinfraStatsId,
  SubcatRadinfraStatsStyleIds,
} from './mapDataSubcategories/subcat_radinfra_stats'
import { SubcatRoadsId, SubcatRoadsStyleIds } from './mapDataSubcategories/subcat_roads.const'
import {
  SubcatRoadsPlusFootwaysId,
  SubcatRoadsPlusFootwaysStyleIds,
} from './mapDataSubcategories/subcat_roads_plus_footways.const'
import {
  SubcatRoadsPlusLabelId,
  SubcatRoadsPlusLabelStyleIds,
} from './mapDataSubcategories/subcat_roads_plus_label.const'
import {
  SubcatRoadsPlusOnewayId,
  SubcatRoadsPlusOnewayStyleIds,
} from './mapDataSubcategories/subcat_roads_plus_oneway.const'
import { SubcatSignsId, SubcatSignsStyleIds } from './mapDataSubcategories/subcat_signs.const'
import {
  SubcatSurfaceBikelaneId,
  SubcatSurfaceBikelaneStyleIds,
} from './mapDataSubcategories/subcat_surface_bikelane'
import {
  SubcatSurfaceRoadsId,
  SubcatSurfaceRoadsStyleIds,
} from './mapDataSubcategories/subcat_surface_roads.const'
import { StaticMapDataCategory } from './types'

export type SubcategoryId =
  | SubcatAccidentsId
  | SubcatBicycleParkingId
  | SubcatBikelanesId
  | SubcatBikelanesPlusBikeSuitabilityId
  | SubcatBikelanesPlusPresenceId
  | SubcatBikelanesPlusRoutesId
  | SubcatBikelanesPlusSignsId
  | SubcatBikelanesPlusSurfaceId
  | SubcatBikelanesPlusVerificationId
  | SubcatBikelanesPlusWidthTextId
  | SubcatBikelanesStatsId
  | SubcatLitId
  | SubcatLitPlusCompletenessId
  | SubcatLitPlusFreshnessId
  | SubcatMapillaryCoverageId
  | SubcatMaxspeedId
  | SubcatMaxspeedPlusPresenceId
  | SubcatParkingAreasId
  | SubcatParkingBoundariesId
  | SubcatParkingDebugId
  | SubcatParkingId
  | SubcatParkingPointsId
  | SubcatParkingStatsId
  | SubcatPoiBoundariesId
  | SubcatPoiId
  | SubcatPoiPlacesId
  | SubcatPoiPlusBarriersId
  | SubcatPoiPlusLanduseId
  | SubcatPoiPlusPublicTransportId
  | SubcatRadinfraCampaignId
  | SubcatRadinfraStatsId
  | SubcatRadinfraStatsId
  | SubcatRoadsId
  | SubcatRoadsPlusFootwaysId
  | SubcatRoadsPlusLabelId
  | SubcatRoadsPlusOnewayId
  | SubcatSignsId
  | SubcatSurfaceBikelaneId
  | SubcatSurfaceRoadsId

type StyleIdDefaults = StaticMapDataCategory['subcategories'][number]['defaultStyle']

export type StyleId =
  | StyleIdDefaults
  | SubcatAccidentsStyleIds
  | SubcatBicycleParkingStyleIds
  | SubcatBikelanesPlusBikeSuitabilityStyleIds
  | SubcatBikelanesPlusPresenceStyleIds
  | SubcatBikelanesPlusRoutesStyleIds
  | SubcatBikelanesPlusSignsStyleIds
  | SubcatBikelanesPlusSurfaceStyleIds
  | SubcatBikelanesPlusVerificationStyleIds
  | SubcatBikelanesPlusWidthTextStyleIds
  | SubcatBikelanesStatsStyleIds
  | SubcatBikelanesStyleIds
  | SubcatLitPlusCompletenessStyleIds
  | SubcatLitPlusFreshnessStyleIds
  | SubcatLitStyleIds
  | SubcatMapillaryCoverageStyleIds
  | SubcatMaxspeedPlusPresenceStyleIds
  | SubcatMaxspeedStyleIds
  | SubcatParkingAreasStyleIds
  | SubcatParkingBoundariesStyleIds
  | SubcatParkingDebugStyleIds
  | SubcatParkingPointsStyleIds
  | SubcatParkingStatsStyleIds
  | SubcatParkingStyleIds
  | SubcatPoiBoundariesStyleIds
  | SubcatPoiPlacesStyleIds
  | SubcatPoiPlusBarriersStyleIds
  | SubcatPoiPlusLanduseStyleIds
  | SubcatPoiPlusPublicTransportStyleIds
  | SubcatPoiStyleIds
  | SubcatRadinfraCampaignStyleIds
  | SubcatRadinfraStatsStyleIds
  | SubcatRadinfraStatsStyleIds
  | SubcatRoadsPlusFootwaysStyleIds
  | SubcatRoadsPlusLabelStyleIds
  | SubcatRoadsPlusOnewayStyleIds
  | SubcatRoadsStyleIds
  | SubcatSignsStyleIds
  | SubcatSurfaceBikelaneStyleIds
  | SubcatSurfaceRoadsStyleIds

export type LegendId = string // TODO: We can make this more precise later
