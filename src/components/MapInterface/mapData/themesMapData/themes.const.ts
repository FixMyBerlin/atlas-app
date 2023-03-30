import { MapDataTheme } from '../types'

// TODO type MapDataConfigThemeIds = typeof sources[number]['id']
export type MapDataThemeIds =
  | 'fromTo'
  | 'bikelanes'
  | 'roadClassification'
  | 'surface'
  | 'parking'
  | 'lit'
  // ZES only:
  | 'fromToZes'
  | 'bikelanesZes'
  | 'roadClassificationZes'
  | 'maxspeed'
  | 'surfaceZes'
  // Special only:
  | 'mapillary'
  | 'accidents'

export const themes: MapDataTheme[] = [
  {
    id: 'fromTo',
    name: 'Quellen & Ziele',
    desc: 'Darstellung von häufigen Start- und Zielpunkten für die Radnetzplanung.',
    // TODO We will likely want overwrites per region. In this case, we might want to move the relation region>theme>topic inside the region so we can specify theme+topic on region level.
    topics: [
      { id: 'shops', defaultActive: true },
      // { id: 'publicTransport', defaultActive: false }, // TODO: https://github.com/FixMyBerlin/private-issues/issues/588
      { id: 'education', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'buildings', defaultActive: false },
      { id: 'landuse', defaultActive: true },
      { id: 'barriers', defaultActive: true },
      { id: 'boundaries', defaultActive: false },
    ],
  },
  {
    id: 'fromToZes',
    name: 'Quellen & Ziele ZES',
    desc: 'Darstellung von häufigen Start- und Zielpunkten für die Radnetzplanung.',
    // TODO We will likely want overwrites per region. In this case, we might want to move the relation region>theme>topic inside the region so we can specify theme+topic on region level.
    topics: [
      { id: 'shops', defaultActive: true },
      { id: 'shops_osmscripts', defaultActive: false },
      { id: 'education', defaultActive: true },
      { id: 'education_osmscripts', defaultActive: false },
      { id: 'publicTransport', defaultActive: true },
      { id: 'publicTransport_osmscripts', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'roadClassification', defaultActive: false },
      { id: 'roadClassification_osmscripts', defaultActive: false },
      { id: 'landuse', defaultActive: true },
    ],
  },
  {
    id: 'roadClassification',
    name: 'Straßentypen',
    desc: 'Darstellung des Straßenlandes anhand von Klassifizierungskriterien zur Radnetzplanung.',
    topics: [
      { id: 'roadClassification', defaultActive: true },
      { id: 'bikelanes', defaultActive: false },
      { id: 'maxspeed', defaultActive: false },
      { id: 'surfaceQuality', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: false },
    ],
  },
  {
    id: 'roadClassificationZes',
    name: 'Straßentypen ZES',
    desc: 'Darstellung des Straßenlandes anhand von Klassifizierungskriterien zur Radnetzplanung.',
    topics: [
      { id: 'roadClassification', defaultActive: true },
      { id: 'roadClassification_osmscripts', defaultActive: false },
      { id: 'bikelanes', defaultActive: false },
      { id: 'bikelanes_osmscripts', defaultActive: false },
      // { id: 'surface_tarmac', defaultActive: false },
      { id: 'surface_osmscripts', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: true },
    ],
  },
  {
    id: 'bikelanes',
    name: 'Radinfrastruktur',
    desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
    topics: [
      { id: 'bikelanes', defaultActive: true },
      { id: 'bikelanesPresence', defaultActive: false },
      // { id: 'surface_tarmac', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: false },
    ],
  },
  {
    id: 'bikelanesZes',
    name: 'Infrastruktur ZES',
    desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
    topics: [
      { id: 'bikelanes', defaultActive: true },
      { id: 'bikelanesPresence', defaultActive: false },
      { id: 'bikelanes_osmscripts', defaultActive: false },
      // { id: 'surface_tarmac', defaultActive: false },
      { id: 'surface_osmscripts', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: true },
    ],
  },

  {
    id: 'surface',
    name: 'Oberflächen',
    desc: 'Darstellung der Oberflächenqualität des Straßenlades für Auto-, Rad- und Fußverkehr',
    topics: [
      // { id: 'surface_tarmac', defaultActive: true },
      { id: 'bikelanes', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: true },
    ],
  },
  {
    id: 'surfaceZes',
    name: 'Oberflächen ZES',
    desc: 'Darstellung der Oberflächenqualität des Straßenlades für Auto-, Rad- und Fußverkehr',
    topics: [
      // { id: 'surface_tarmac', defaultActive: true },
      { id: 'surface_osmscripts', defaultActive: false },
      { id: 'bikelanes', defaultActive: false },
      { id: 'bikelanes_osmscripts', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: true },
    ],
  },
  {
    id: 'parking',
    name: 'Parkraum',
    desc: 'Auswertung zum Parken im Straßenraum',
    topics: [
      { id: 'parking', defaultActive: true },
      // { id: 'parkingLegacy', defaultActive: false },
      { id: 'parkingPoints', defaultActive: false },
      { id: 'parkingAreas', defaultActive: true },
      { id: 'parkingDebug', defaultActive: false },
      { id: 'parkingStats', defaultActive: false },
      { id: 'landuse', defaultActive: false },
      // { id: 'mapillaryCoverage', defaultActive: false },
      // { id: 'accidents', defaultActive: false },
    ],
  },
  {
    id: 'lit',
    name: 'Beleuchtung',
    desc: 'Darstellung der Beleuchtung im Straßenland für Auto-, Rad- und Fußverkehr',
    topics: [
      { id: 'lit', defaultActive: true },
      // { id: 'surface_tarmac', defaultActive: false },
      { id: 'places', defaultActive: false },
      { id: 'landuse', defaultActive: false },
    ],
  },
  {
    id: 'mapillary',
    name: 'Mapillay',
    desc: '',
    topics: [{ id: 'mapillaryCoverage', defaultActive: true }],
  },
  {
    id: 'accidents',
    name: 'Unfallatlas',
    desc: '',
    topics: [{ id: 'accidents', defaultActive: true }],
  },
]
