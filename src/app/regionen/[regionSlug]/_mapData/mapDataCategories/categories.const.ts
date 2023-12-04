import { MapDataCategory as MapDataCategory } from '../types'

// TODO type MapDataCategoryIds = typeof sources[number]['id']
export type MapDataCategoryIds =
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

export const categories: MapDataCategory[] = [
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9375&mode=design&t=sIuuLD4vxJJzKOWr-0
    id: 'poi',
    name: 'Quellen & Ziele',
    desc: 'Siedlungszentren, Zielorte, Barrieren',
    subcategories: [
      { id: 'poi', defaultStyle: 'default', ui: 'dropdown' },
      { id: 'boundaries', defaultStyle: 'hidden', ui: 'checkbox' },
      { id: 'barriers', defaultStyle: 'hidden', ui: 'checkbox' },
      // { id: 'routes', defaultStyle: 'hidden', ui: 'checkbox' },
      // { id: 'buildings', defaultStyle: 'hidden', ui: 'checkbox' },
      { id: 'landuse', defaultStyle: 'hidden', ui: 'checkbox' },
    ],
  },
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9397&mode=design&t=sIuuLD4vxJJzKOWr-0
    id: 'roads',
    name: 'Straßentypen',
    desc: 'Straßenklassen, Tempolimits',
    subcategories: [
      { id: 'roads', defaultStyle: 'default', ui: 'dropdown' },
      { id: 'maxspeed', defaultStyle: 'hidden', ui: 'dropdown' },
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
      { id: 'roads_legacy', defaultStyle: 'default', ui: 'dropdown' },
      { id: 'maxspeed_legacy', defaultStyle: 'hidden', ui: 'dropdown' },
    ],
  },
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9386&mode=design&t=sIuuLD4vxJJzKOWr-0
    id: 'bikelanes',
    name: 'Radinfrastruktur',
    desc: 'Führungsform, Breite, RVA-Oberfläche',
    subcategories: [
      { id: 'bikelanes', defaultStyle: 'default', ui: 'dropdown' },
      // { id: 'bikelanesWidth', defaultStyle: 'default', ui: 'checkbox' },
      // { id: 'bikelanesSurface', defaultStyle: 'default', ui: 'checkbox' },
      // { id: 'bikelanesOneway', defaultStyle: 'default', ui: 'checkbox' },
      { id: 'signs', defaultStyle: 'hidden', ui: 'checkbox' },
      // { id: 'bikelanesProtection', defaultStyle: 'hidden', ui: 'checkbox' },
      // { id: 'tram', defaultStyle: 'hidden', ui: 'checkbox' },
      { id: 'bikelanesPresence', defaultStyle: 'hidden', ui: 'checkbox' },
    ],
  },
  {
    id: 'bikelanes_LEGACY',
    name: 'Radinfrastruktur OLD',
    desc: 'Führungsform, Breite, RVA-Oberfläche',
    subcategories: [
      { id: 'bikelanes', defaultStyle: 'default', ui: 'dropdown' },
      { id: 'bikelanesPresence_legacy', defaultStyle: 'hidden', ui: 'dropdown' },
    ],
  },
  {
    // Figma https://www.figma.com/file/N9LROlksQn4tGHZp0k0KeS/OSM-Atlas?type=design&node-id=1062-9408&mode=design&t=sIuuLD4vxJJzKOWr-0
    id: 'surface',
    name: 'Oberflächen',
    desc: 'Fahrbahn & Radinfrastruktur',
    subcategories: [
      { id: 'roadsSurface', defaultStyle: 'default', ui: 'dropdown' },
      { id: 'bikelanesSurface', defaultStyle: 'default', ui: 'dropdown' },
      // { id: 'sidewalkSurface', defaultStyle: 'default', ui: 'dropdown' },
    ],
  },
  {
    id: 'surface_LEGACY',
    name: 'Oberflächen OLD',
    desc: 'Fahrbahn & Radinfrastruktur',
    subcategories: [{ id: 'roadsSurface_legacy', defaultStyle: 'default', ui: 'dropdown' }],
  },
  {
    id: 'parking',
    name: 'Parkraum',
    desc: 'Parken im Straßenraum',
    subcategories: [
      { id: 'parking', defaultStyle: 'default', ui: 'dropdown' },
      // { id: 'parkingLegacy', defaultStyle: "hidden" },
      { id: 'parkingPoints', defaultStyle: 'hidden', ui: 'dropdown' },
      { id: 'parkingAreas', defaultStyle: 'default', ui: 'dropdown' },
      { id: 'parkingDebug', defaultStyle: 'hidden', ui: 'dropdown' },
      { id: 'parkingStats', defaultStyle: 'hidden', ui: 'dropdown' },
      { id: 'signs', defaultStyle: 'hidden', ui: 'dropdown' },
      { id: 'landuse', defaultStyle: 'hidden', ui: 'dropdown' },
      // { id: 'mapillaryCoverage', defaultStyle: "hidden" },
      // { id: 'accidents', defaultStyle: "hidden" },
    ],
  },
  {
    id: 'bicycleParking',
    name: 'Fahrradstellplätze',
    desc: '',
    subcategories: [
      { id: 'bicycleParking', defaultStyle: 'default', ui: 'dropdown' },
      { id: 'landuse', defaultStyle: 'hidden', ui: 'dropdown' },
      { id: 'publicTransport', defaultStyle: 'hidden', ui: 'dropdown' }, // TODO: https://github.com/FixMyBerlin/private-issues/issues/588
      { id: 'barriers', defaultStyle: 'default', ui: 'dropdown' },
      { id: 'boundaries', defaultStyle: 'default', ui: 'dropdown' },
    ],
  },
  {
    id: 'statistics',
    name: 'Statistik',
    desc: '',
    subcategories: [
      { id: 'bikelanesStatistics', defaultStyle: 'default', ui: 'dropdown' },
      { id: 'boundaries', defaultStyle: 'default', ui: 'dropdown' },
    ],
  },
  {
    id: 'mapillary',
    name: 'Mapillay',
    desc: '',
    subcategories: [{ id: 'mapillaryCoverage', defaultStyle: 'default', ui: 'dropdown' }],
  },
  {
    id: 'accidents',
    name: 'Unfallatlas',
    desc: '',
    subcategories: [{ id: 'accidents', defaultStyle: 'default', ui: 'dropdown' }],
  },
]
