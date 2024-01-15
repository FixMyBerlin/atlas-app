import { subcat_accidents } from '../mapDataSubcategories/subcat_accidents.const'
import { subcat_poi_plus_barriers } from '../mapDataSubcategories/subcat_poi_plus_barriers.const'
import { subcat_bicycleParking } from '../mapDataSubcategories/subcat_bicycleParking'
import { subcat_bikelanes } from '../mapDataSubcategories/subcat_bikelanes.const'
import { subcat_bikelanesPresence } from '../mapDataSubcategories/subcat_bikelanesPresence.const'
import { subcat_bikelanesPresence_legacy } from '../mapDataSubcategories/subcat_bikelanesPresence_legacy.const'
import { subcat_bikelanesStatistics } from '../mapDataSubcategories/subcat_bikelanesStatistics.const'
import { subcat_bikelanes_plus_signs } from '../mapDataSubcategories/subcat_bikelanes_plus_signs.const'
import { subcat_bikelanes_plus_surface_text } from '../mapDataSubcategories/subcat_bikelanes_plus_surface_text.const'
import { subcat_bikelanes_plus_width_text } from '../mapDataSubcategories/subcat_bikelanes_plus_width_text.const'
import { subcat_poi_boundaries } from '../mapDataSubcategories/subcat_poi_boundaries.const'
import { subcat_poi_plus_landuse } from '../mapDataSubcategories/subcat_poi_plus_landuse.const'
import { subcat_mapillaryCoverage } from '../mapDataSubcategories/subcat_mapillaryCoverage.const'
import { subcat_maxspeed } from '../mapDataSubcategories/subcat_maxspeed.const'
import { subcat_maxspeed_legacy } from '../mapDataSubcategories/subcat_maxspeed_legacy.const'
import { subcat_parking } from '../mapDataSubcategories/subcat_parking.const'
import { subcat_parkingAreas } from '../mapDataSubcategories/subcat_parkingAreas.const'
import { subcat_parkingDebug } from '../mapDataSubcategories/subcat_parkingDebug.const'
import { subcat_parkingPoints } from '../mapDataSubcategories/subcat_parkingPoints.const'
import { subcat_parkingStats } from '../mapDataSubcategories/subcat_parkingStats.const'
import { subcat_poi_places } from '../mapDataSubcategories/subcat_poi_places.const'
import { subcat_poi } from '../mapDataSubcategories/subcat_poi.const'
import { subcat_poi_plus_publicTransport } from '../mapDataSubcategories/subcat_poi_plus_publicTransport.const'
import { subcat_roads } from '../mapDataSubcategories/subcat_roads.const'
import { subcat_roadsSurface_legacy } from '../mapDataSubcategories/subcat_roadsSurface_legacy.const'
import { subcat_roads_legacy } from '../mapDataSubcategories/subcat_roads_legacy.const'
import { subcat_roads_plus_footways } from '../mapDataSubcategories/subcat_roads_plus_footways.const'
import { subcat_signs } from '../mapDataSubcategories/subcat_signs.const'
import { subcat_surface_bikelane } from '../mapDataSubcategories/subcat_surface_bikelane'
import { subcat_surface_roads } from '../mapDataSubcategories/subcat_surface_roads.const'
import { StaticMapDataCategory } from '../types'

// TODO type MapDataCategoryIds = typeof sources[number]['id']
export type MapDataCategoryId =
  // Radverkehrsatlas
  | 'bikelanes_LEGACY'
  | 'bikelanes'
  | 'poi'
  | 'roads_LEGACY'
  | 'roads'
  | 'statistics'
  | 'surface_LEGACY'
  | 'surface'
  // Parking Atlas
  | 'parking'
  // bicycleParking Atlas
  | 'bicycleParking'
  // Special only:
  | 'mapillary'
  | 'accidents'
  | 'trafficSigns'

export const categories: StaticMapDataCategory[] = [
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9375&mode=design&t=k2PHofwptElXro3a-0
    id: 'poi',
    name: 'Quellen & Ziele',
    desc: 'Siedlungszentren, Zielorte, Barrieren',
    subcategories: [
      { ...subcat_poi, defaultStyle: 'default' },
      { ...subcat_poi_places, defaultStyle: 'default' },
      { ...subcat_poi_boundaries, defaultStyle: 'hidden' },
      { ...subcat_poi_plus_barriers, defaultStyle: 'hidden' },
      { ...subcat_poi_plus_landuse, defaultStyle: 'hidden' },
      { ...subcat_poi_plus_publicTransport, defaultStyle: 'hidden' },
      // { id: 'subcat_poi_plus_routes', defaultStyle: 'hidden' },
      // { id: 'subcat_poi_plus_buildings', defaultStyle: 'hidden' },
    ],
  },
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9397&mode=design&t=k2PHofwptElXro3a-0
    id: 'roads',
    name: 'Straßentypen',
    desc: 'Straßenklassen, Tempolimits',
    subcategories: [
      { ...subcat_roads, defaultStyle: 'default' },
      { ...subcat_maxspeed, defaultStyle: 'hidden' },
      { ...subcat_roads_plus_footways, defaultStyle: 'hidden' },
      // { id: 'subcat_roads_plus_lanes_text', defaultStyle: 'hidden' },
      // { id: 'subcat_roads_plus_surface_text', defaultStyle: 'hidden' },
      // { id: 'subcat_roads_plus_completness', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'roads_LEGACY',
    name: 'Straßentypen OLD',
    desc: 'Straßenklassen, Tempolimits',
    subcategories: [
      { ...subcat_roads_legacy, defaultStyle: 'default' },
      { ...subcat_maxspeed_legacy, defaultStyle: 'hidden' },
    ],
  },
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9386&mode=design&t=sIuuLD4vxJJzKOWr-0
    id: 'bikelanes',
    name: 'Radinfrastruktur',
    desc: 'Führungsform, Breite, RVA-Oberfläche',
    subcategories: [
      { ...subcat_bikelanes, defaultStyle: 'default' },
      { ...subcat_bikelanes_plus_width_text, defaultStyle: 'hidden' },
      { ...subcat_bikelanes_plus_surface_text, defaultStyle: 'hidden' },
      // { id: 'bikelanesOneway', defaultStyle: 'default' },
      { ...subcat_bikelanes_plus_signs, defaultStyle: 'hidden' },
      { ...subcat_bikelanesPresence, defaultStyle: 'hidden' },
      // { id: 'bikelanesProtection', defaultStyle: 'hidden' },
      // { id: 'tram', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'bikelanes_LEGACY',
    name: 'Radinfrastruktur OLD',
    desc: 'Führungsform, Breite, RVA-Oberfläche',
    subcategories: [{ ...subcat_bikelanesPresence_legacy, defaultStyle: 'default' }],
  },
  {
    id: 'trafficSigns',
    name: 'Verkehrszeichen (WIP)',
    desc: 'Als Punkt erfasste Verkehrszeichen aus OSM.',
    subcategories: [{ ...subcat_signs, defaultStyle: 'hidden' }],
  },
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9408&mode=design&t=k2PHofwptElXro3a-0
    id: 'surface',
    name: 'Oberflächen',
    desc: 'Fahrbahn & Radinfrastruktur',
    subcategories: [
      { ...subcat_surface_roads, defaultStyle: 'default' },
      { ...subcat_surface_bikelane, defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'surface_LEGACY',
    name: 'Oberflächen OLD',
    desc: 'Fahrbahn & Radinfrastruktur',
    subcategories: [{ ...subcat_roadsSurface_legacy, defaultStyle: 'default' }],
  },
  {
    id: 'parking',
    name: 'Parkraum',
    desc: 'Parken im Straßenraum',
    subcategories: [
      { ...subcat_parking, defaultStyle: 'default' },
      // { id: 'parkingLegacy', defaultStyle: "hidden" },
      { ...subcat_parkingPoints, defaultStyle: 'hidden' },
      { ...subcat_parkingAreas, defaultStyle: 'default' },
      { ...subcat_parkingDebug, defaultStyle: 'hidden' },
      { ...subcat_parkingStats, defaultStyle: 'hidden' },
      { ...subcat_signs, defaultStyle: 'hidden' },
      // { id: 'mapillaryCoverage', defaultStyle: "hidden" },
      // { id: 'accidents', defaultStyle: "hidden" },
    ],
  },
  {
    id: 'bicycleParking',
    name: 'Fahrradstellplätze',
    desc: '',
    subcategories: [{ ...subcat_bicycleParking, defaultStyle: 'default' }],
  },
  {
    id: 'statistics',
    name: 'Statistik',
    desc: '',
    subcategories: [
      { ...subcat_bikelanesStatistics, defaultStyle: 'default' },
      { ...subcat_poi_boundaries, defaultStyle: 'default' },
    ],
  },
  {
    id: 'mapillary',
    name: 'Mapillay',
    desc: 'Straßenfotos',
    subcategories: [{ ...subcat_mapillaryCoverage, defaultStyle: 'default' }],
  },
  {
    id: 'accidents',
    name: 'Unfallatlas',
    desc: 'Unfalldaten',
    subcategories: [{ ...subcat_accidents, defaultStyle: 'default' }],
  },
]
