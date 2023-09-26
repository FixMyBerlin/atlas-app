import { MapDataTheme } from '../types'

// TODO type MapDataConfigThemeIds = typeof sources[number]['id']
export type MapDataThemeIds =
  | 'fromTo'
  | 'bikelanes'
  | 'bikelanes_NEW' // TODO TEMP
  | 'roadClassification'
  | 'roadClassification_NEW' // TODO TEMP
  | 'surface'
  | 'surface_NEW' // TODO TEMP
  | 'parking'
  | 'lit'
  | 'lit_NEW' // TODO TEMP
  // Special only:
  | 'mapillary'
  | 'accidents'

export const themes: MapDataTheme[] = [
  {
    id: 'fromTo',
    name: 'Quellen & Ziele',
    desc: 'Start- und Zielpunkten für die Radnetzplanung.',
    // TODO We will likely want overwrites per region. In this case, we might want to move the relation region>theme>topic inside the region so we can specify theme+topic on region level.
    topics: [
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
    topics: [
      { id: 'roadClassification_legacy', defaultStyle: 'default' },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'maxspeed_legacy', defaultStyle: 'hidden' },
      { id: 'surfaceQuality_legacy', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'roadClassification_NEW',
    name: 'Straßentypen NEW',
    desc: 'Klassifiziert zur Radnetzplanung.',
    topics: [
      { id: 'roadClassification_legacy', defaultStyle: 'hidden' },
      { id: 'roadClassification', defaultStyle: 'default' },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'maxspeed_legacy', defaultStyle: 'hidden' },
      { id: 'maxspeed', defaultStyle: 'hidden' },
      { id: 'surfaceQuality_legacy', defaultStyle: 'hidden' },
      { id: 'surfaceQuality', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'bikelanes',
    name: 'Radinfrastruktur',
    desc: 'Führungsformen Radinfrastruktur.',
    topics: [
      { id: 'bikelanes', defaultStyle: 'default' },
      { id: 'bikelanesPresence_legacy', defaultStyle: 'hidden' },
      // { id: 'surface_tarmac', defaultStyle: "hidden" },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'bikelanes_NEW',
    name: 'Radinfrastruktur NEW',
    desc: 'Führungsformen Radinfrastruktur.',
    topics: [
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'bikelanesPresence_legacy', defaultStyle: 'hidden' },
      { id: 'bikelanesPresence', defaultStyle: 'default' },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'surface',
    name: 'Oberflächen NEW',
    desc: 'Oberflächen und Oberflächenqualität.',
    topics: [
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
    topics: [
      { id: 'parking', defaultStyle: 'default' },
      // { id: 'parkingLegacy', defaultStyle: "hidden" },
      { id: 'parkingPoints', defaultStyle: 'hidden' },
      { id: 'parkingAreas', defaultStyle: 'default' },
      { id: 'parkingDebug', defaultStyle: 'hidden' },
      { id: 'parkingStats', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
      // { id: 'mapillaryCoverage', defaultStyle: "hidden" },
      // { id: 'accidents', defaultStyle: "hidden" },
    ],
  },
  {
    id: 'lit',
    name: 'Beleuchtung',
    desc: 'Beleuchtung im Straßenland',
    topics: [
      { id: 'lit_legacy', defaultStyle: 'default' },
      // { id: 'surface_tarmac', defaultStyle: "hidden" },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'lit_NEW',
    name: 'Beleuchtung NEW',
    desc: 'Beleuchtung im Straßenland.  ',
    topics: [
      { id: 'lit', defaultStyle: 'hidden' },
      { id: 'lit_legacy', defaultStyle: 'default' },
      // { id: 'surface_tarmac', defaultStyle: "hidden" },
      { id: 'places', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'mapillary',
    name: 'Mapillay',
    desc: '',
    topics: [{ id: 'mapillaryCoverage', defaultStyle: 'default' }],
  },
  {
    id: 'accidents',
    name: 'Unfallatlas',
    desc: '',
    topics: [{ id: 'accidents', defaultStyle: 'default' }],
  },
]
