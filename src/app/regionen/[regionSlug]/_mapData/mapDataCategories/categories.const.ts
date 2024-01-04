import { subcat_accidents } from '../mapDataSubcategories/subcat_accidents.const'
import { subcat_barriers } from '../mapDataSubcategories/subcat_barriers.const'
import { subcat_bicycleParking } from '../mapDataSubcategories/subcat_bicycleParking'
import { subcat_bikelanes } from '../mapDataSubcategories/subcat_bikelanes.const'
import { subcat_bikelanesPresence } from '../mapDataSubcategories/subcat_bikelanesPresence.const'
import { subcat_bikelanesPresence_legacy } from '../mapDataSubcategories/subcat_bikelanesPresence_legacy.const'
import { subcat_bikelanesStatistics } from '../mapDataSubcategories/subcat_bikelanesStatistics.const'
import { subcat_bikelanesSurface } from '../mapDataSubcategories/subcat_bikelanesSurface.const'
import { subcat_bikelanes_plus_signs } from '../mapDataSubcategories/subcat_bikelanes_plus_signs.const'
import { subcat_bikelanes_plus_smoothness } from '../mapDataSubcategories/subcat_bikelanes_plus_smoothness'
import { subcat_bikelanes_plus_surface } from '../mapDataSubcategories/subcat_bikelanes_plus_surface.const'
import { subcat_bikelanes_plus_width } from '../mapDataSubcategories/subcat_bikelanes_plus_width.const'
import { subcat_boundaries } from '../mapDataSubcategories/subcat_boundaries.const'
import { subcat_landuse } from '../mapDataSubcategories/subcat_landuse.const'
import { subcat_mapillaryCoverage } from '../mapDataSubcategories/subcat_mapillaryCoverage.const'
import { subcat_maxspeed } from '../mapDataSubcategories/subcat_maxspeed.const'
import { subcat_maxspeed_legacy } from '../mapDataSubcategories/subcat_maxspeed_legacy.const'
import { subcat_parking } from '../mapDataSubcategories/subcat_parking.const'
import { subcat_parkingAreas } from '../mapDataSubcategories/subcat_parkingAreas.const'
import { subcat_parkingDebug } from '../mapDataSubcategories/subcat_parkingDebug.const'
import { subcat_parkingPoints } from '../mapDataSubcategories/subcat_parkingPoints.const'
import { subcat_parkingStats } from '../mapDataSubcategories/subcat_parkingStats.const'
import { subcat_places } from '../mapDataSubcategories/subcat_places.const'
import { subcat_poi } from '../mapDataSubcategories/subcat_poi.const'
import { subcat_publicTransport } from '../mapDataSubcategories/subcat_publicTransport.const'
import { subcat_roads } from '../mapDataSubcategories/subcat_roads.const'
import { subcat_roadsSurface } from '../mapDataSubcategories/subcat_roadsSurface.const'
import { subcat_roadsSurface_legacy } from '../mapDataSubcategories/subcat_roadsSurface_legacy.const'
import { subcat_roads_legacy } from '../mapDataSubcategories/subcat_roads_legacy.const'
import { subcat_roads_plus_footways } from '../mapDataSubcategories/subcat_roads_plus_footways.const'
import { subcat_signs } from '../mapDataSubcategories/subcat_signs.const'
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

export const categories: StaticMapDataCategory[] = [
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9375&mode=design&t=sIuuLD4vxJJzKOWr-0
    id: 'poi',
    name: 'Quellen & Ziele',
    desc: 'Siedlungszentren, Zielorte, Barrieren',
    subcategories: [
      { ...subcat_poi, defaultStyle: 'default', ui: 'dropdown' },
      { ...subcat_boundaries, defaultStyle: 'hidden', ui: 'checkbox' },
      { ...subcat_barriers, defaultStyle: 'hidden', ui: 'checkbox' },
      // { id: 'routes', defaultStyle: 'hidden', ui: 'checkbox' },
      // { id: 'buildings', defaultStyle: 'hidden', ui: 'checkbox' },
      { ...subcat_landuse, defaultStyle: 'hidden', ui: 'checkbox' },
      { ...subcat_places, defaultStyle: 'default', ui: 'dropdown' },
      { ...subcat_publicTransport, defaultStyle: 'hidden', ui: 'dropdown' },
    ],
  },
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9397&mode=design&t=sIuuLD4vxJJzKOWr-0
    id: 'roads',
    name: 'Straßentypen',
    desc: 'Straßenklassen, Tempolimits',
    subcategories: [
      { ...subcat_roads, defaultStyle: 'default', ui: 'dropdown' },
      { ...subcat_maxspeed, defaultStyle: 'hidden', ui: 'dropdown' },
      { ...subcat_roads_plus_footways, defaultStyle: 'hidden', ui: 'checkbox' },
      // { id: 'path', defaultStyle: 'hidden', ui: 'checkbox' }, // TODO NOW
      // { id: 'lanes', defaultStyle: 'hidden', ui: 'checkbox' }, // TODO NOW
      // { id: 'roadCompletness', defaultStyle: 'hidden', ui: 'checkbox' },
    ],
  },
  {
    id: 'roads_LEGACY',
    name: 'Straßentypen OLD',
    desc: 'Straßenklassen, Tempolimits',
    subcategories: [
      { ...subcat_roads_legacy, defaultStyle: 'default', ui: 'dropdown' },
      { ...subcat_maxspeed_legacy, defaultStyle: 'hidden', ui: 'dropdown' },
    ],
  },
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9386&mode=design&t=sIuuLD4vxJJzKOWr-0
    id: 'bikelanes',
    name: 'Radinfrastruktur',
    desc: 'Führungsform, Breite, RVA-Oberfläche',
    subcategories: [
      { ...subcat_bikelanes, defaultStyle: 'default', ui: 'dropdown' },
      // { id: 'bikelanesWidth', defaultStyle: 'default', ui: 'checkbox' },
      // { id: 'bikelanesSurface', defaultStyle: 'default', ui: 'checkbox' },
      // { id: 'bikelanesOneway', defaultStyle: 'default', ui: 'checkbox' },
      { ...subcat_bikelanes_plus_signs, defaultStyle: 'hidden', ui: 'checkbox' },
      { ...subcat_signs, defaultStyle: 'hidden', ui: 'checkbox' },
      { ...subcat_bikelanes_plus_width, defaultStyle: 'hidden', ui: 'checkbox' },
      { ...subcat_bikelanes_plus_surface, defaultStyle: 'hidden', ui: 'checkbox' },
      { ...subcat_bikelanes_plus_smoothness, defaultStyle: 'hidden', ui: 'checkbox' },
      // { id: 'bikelanesProtection', defaultStyle: 'hidden', ui: 'checkbox' },
      // { id: 'tram', defaultStyle: 'hidden', ui: 'checkbox' },
      { ...subcat_bikelanesPresence, defaultStyle: 'hidden', ui: 'checkbox' },
    ],
  },
  {
    id: 'bikelanes_LEGACY',
    name: 'Radinfrastruktur OLD',
    desc: 'Führungsform, Breite, RVA-Oberfläche',
    subcategories: [
      { ...subcat_bikelanesPresence_legacy, defaultStyle: 'default', ui: 'dropdown' },
    ],
  },
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9408&mode=design&t=sIuuLD4vxJJzKOWr-0
    id: 'surface',
    name: 'Oberflächen',
    desc: 'Fahrbahn & Radinfrastruktur',
    subcategories: [
      { ...subcat_roadsSurface, defaultStyle: 'default', ui: 'dropdown' },
      { ...subcat_bikelanesSurface, defaultStyle: 'default', ui: 'dropdown' },
      // { id: 'sidewalkSurface', defaultStyle: 'default', ui: 'dropdown' },
    ],
  },
  {
    id: 'surface_LEGACY',
    name: 'Oberflächen OLD',
    desc: 'Fahrbahn & Radinfrastruktur',
    subcategories: [{ ...subcat_roadsSurface_legacy, defaultStyle: 'default', ui: 'dropdown' }],
  },
  {
    id: 'parking',
    name: 'Parkraum',
    desc: 'Parken im Straßenraum',
    subcategories: [
      { ...subcat_parking, defaultStyle: 'default', ui: 'dropdown' },
      // { id: 'parkingLegacy', defaultStyle: "hidden" },
      { ...subcat_parkingPoints, defaultStyle: 'hidden', ui: 'dropdown' },
      { ...subcat_parkingAreas, defaultStyle: 'default', ui: 'dropdown' },
      { ...subcat_parkingDebug, defaultStyle: 'hidden', ui: 'dropdown' },
      { ...subcat_parkingStats, defaultStyle: 'hidden', ui: 'dropdown' },
      { ...subcat_signs, defaultStyle: 'hidden', ui: 'dropdown' },
      { ...subcat_landuse, defaultStyle: 'hidden', ui: 'dropdown' },
      // { id: 'mapillaryCoverage', defaultStyle: "hidden" },
      // { id: 'accidents', defaultStyle: "hidden" },
    ],
  },
  {
    id: 'bicycleParking',
    name: 'Fahrradstellplätze',
    desc: '',
    subcategories: [
      { ...subcat_bicycleParking, defaultStyle: 'default', ui: 'dropdown' },
      { ...subcat_landuse, defaultStyle: 'hidden', ui: 'dropdown' },
      { ...subcat_publicTransport, defaultStyle: 'hidden', ui: 'dropdown' }, // TODO: https://github.com/FixMyBerlin/private-issues/issues/588
      { ...subcat_barriers, defaultStyle: 'default', ui: 'dropdown' },
      { ...subcat_boundaries, defaultStyle: 'default', ui: 'dropdown' },
    ],
  },
  {
    id: 'statistics',
    name: 'Statistik',
    desc: '',
    subcategories: [
      { ...subcat_bikelanesStatistics, defaultStyle: 'default', ui: 'dropdown' },
      { ...subcat_boundaries, defaultStyle: 'default', ui: 'dropdown' },
    ],
  },
  {
    id: 'mapillary',
    name: 'Mapillay',
    desc: '',
    subcategories: [{ ...subcat_mapillaryCoverage, defaultStyle: 'default', ui: 'dropdown' }],
  },
  {
    id: 'accidents',
    name: 'Unfallatlas',
    desc: '',
    subcategories: [{ ...subcat_accidents, defaultStyle: 'default', ui: 'dropdown' }],
  },
]
