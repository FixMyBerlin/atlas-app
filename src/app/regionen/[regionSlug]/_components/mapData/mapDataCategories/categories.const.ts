import { MapDataCategory as MapDataCategory } from '../types'

// TODO type MapDataCategoryIds = typeof sources[number]['id']
export type MapDataCategoryIds =
  | 'bicycleParking'
  | 'bikelanes_NEW' // TODO TEMP
  | 'bikelanes'
  | 'fromTo'
  | 'lit_NEW' // TODO TEMP
  | 'lit'
  | 'parking'
  | 'roadClassification_NEW' // TODO TEMP
  | 'roadClassification'
  | 'surface_NEW' // TODO TEMP
  | 'surface'
  // Special only:
  | 'mapillary'
  | 'accidents'

export const categories: MapDataCategory[] = [
  {
    id: 'fromTo',
    name: 'Quellen & Ziele',
    desc: 'Start- und Zielpunkten für die Radnetzplanung.',
    // TODO We will likely want overwrites per region. In this case, we might want to move the relation region>category>subcategory inside the region so we can specify categories + subcategories on region level.
    subcategories: [
      { id: 'shops', defaultStyle: 'default' },
      // { id: 'publicTransport', defaultStyle: "hidden" }, // TODO: https://github.com/FixMyBerlin/private-issues/issues/588
      { id: 'education', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'buildings', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'default' },
      { id: 'barriers', defaultStyle: 'default' },
      { id: 'boundaries', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'roadClassification',
    name: 'Straßentypen',
    desc: 'Klassifiziert zur Radnetzplanung.',
    subcategories: [
      { id: 'roadClassification_legacy', defaultStyle: 'default' },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'maxspeed_legacy', defaultStyle: 'hidden' },
      { id: 'surfaceQuality_legacy', defaultStyle: 'hidden' },
      { id: 'trafficSigns', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'roadClassification_NEW',
    name: 'Straßentypen NEW',
    desc: 'Klassifiziert zur Radnetzplanung.',
    subcategories: [
      { id: 'roadClassification_legacy', defaultStyle: 'hidden' },
      { id: 'roadClassification', defaultStyle: 'default' },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'maxspeed_legacy', defaultStyle: 'hidden' },
      { id: 'maxspeed', defaultStyle: 'hidden' },
      { id: 'surfaceQuality_legacy', defaultStyle: 'hidden' },
      { id: 'surfaceQuality', defaultStyle: 'hidden' },
      { id: 'trafficSigns', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'bikelanes',
    name: 'Radinfrastruktur',
    desc: 'Führungsformen Radinfrastruktur.',
    subcategories: [
      { id: 'bikelanes', defaultStyle: 'default' },
      { id: 'bikelanesPresence_legacy', defaultStyle: 'hidden' },
      // { id: 'surface_tarmac', defaultStyle: "hidden" },
      { id: 'trafficSigns', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'bikelanes_NEW',
    name: 'Radinfrastruktur NEW',
    desc: 'Führungsformen Radinfrastruktur.',
    subcategories: [
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'bikelanesPresence_legacy', defaultStyle: 'hidden' },
      { id: 'bikelanesPresence', defaultStyle: 'default' },
      { id: 'trafficSigns', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'surface',
    name: 'Oberflächen',
    desc: 'Darstellung der Oberflächenqualität des Straßenlades für Auto-, Rad- und Fußverkehr',
    subcategories: [
      { id: 'surfaceQuality', defaultStyle: 'default' },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'surface_NEW',
    name: 'Oberflächen NEW',
    desc: 'Oberflächen und Oberflächenqualität.',
    subcategories: [
      { id: 'surfaceQuality', defaultStyle: 'default' },
      { id: 'surfaceQuality_legacy', defaultStyle: 'hidden' },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'parking',
    name: 'Parkraum',
    desc: 'Parken im Straßenraum.',
    subcategories: [
      { id: 'parking', defaultStyle: 'default' },
      // { id: 'parkingLegacy', defaultStyle: "hidden" },
      { id: 'parkingPoints', defaultStyle: 'hidden' },
      { id: 'parkingAreas', defaultStyle: 'default' },
      { id: 'parkingDebug', defaultStyle: 'hidden' },
      { id: 'parkingStats', defaultStyle: 'hidden' },
      { id: 'trafficSigns', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
      // { id: 'mapillaryCoverage', defaultStyle: "hidden" },
      // { id: 'accidents', defaultStyle: "hidden" },
    ],
  },
  {
    id: 'lit',
    name: 'Beleuchtung',
    desc: 'Beleuchtung im Straßenland',
    subcategories: [
      { id: 'lit_legacy', defaultStyle: 'default' },
      // { id: 'surface_tarmac', defaultStyle: "hidden" },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'lit_NEW',
    name: 'Beleuchtung NEW',
    desc: 'Beleuchtung im Straßenland.',
    subcategories: [
      { id: 'lit', defaultStyle: 'hidden' },
      { id: 'lit_legacy', defaultStyle: 'default' },
      // { id: 'surface_tarmac', defaultStyle: "hidden" },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'bicycleParking',
    name: 'Fahrradstellplätze',
    desc: '',
    subcategories: [
      { id: 'bicycleParking', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'hidden' },
      { id: 'publicTransport', defaultStyle: 'hidden' }, // TODO: https://github.com/FixMyBerlin/private-issues/issues/588
      { id: 'barriers', defaultStyle: 'default' },
      { id: 'boundaries', defaultStyle: 'default' },
    ],
  },
  {
    id: 'mapillary',
    name: 'Mapillay',
    desc: '',
    subcategories: [{ id: 'mapillaryCoverage', defaultStyle: 'default' }],
  },
  {
    id: 'accidents',
    name: 'Unfallatlas',
    desc: '',
    subcategories: [{ id: 'accidents', defaultStyle: 'default' }],
  },
]
