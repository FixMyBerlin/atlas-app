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
  | 'surfaceZes'
  // Speical only:
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
      { id: 'publicTransport_tarmac', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: true },
    ],
  },
  {
    id: 'fromToZes',
    name: 'Quellen & Ziele',
    desc: 'Darstellung von häufigen Start- und Zielpunkten für die Radnetzplanung.',
    // TODO We will likely want overwrites per region. In this case, we might want to move the relation region>theme>topic inside the region so we can specify theme+topic on region level.
    topics: [
      { id: 'shops', defaultActive: true },
      { id: 'shops_osmscripts', defaultActive: false },
      { id: 'education', defaultActive: true },
      { id: 'education_osmscripts', defaultActive: false },
      // { id: 'publicTransport_tarmac', defaultActive: true },
      // { id: 'publicTransport_osmscripts', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'roadClassification_tarmac', defaultActive: false },
      { id: 'roadClassification_osmscripts', defaultActive: false },
      { id: 'landuse', defaultActive: true },
    ],
  },
  {
    id: 'bikelanes',
    name: 'Infrastruktur',
    desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
    topics: [
      { id: 'bikelanes', defaultActive: true },
      { id: 'surface_tarmac', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: false },
    ],
  },
  {
    id: 'bikelanesZes',
    name: 'Infrastruktur',
    desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
    topics: [
      { id: 'bikelanes', defaultActive: true },
      { id: 'bikelanes_osmscripts', defaultActive: false },
      { id: 'surface_tarmac', defaultActive: false },
      { id: 'surface_osmscripts', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: true },
    ],
  },
  {
    id: 'roadClassification',
    name: 'Straßentypen',
    desc: 'Darstellung des Straßenlandes anhand von Klassifizierungskriterien zur Radnetzplanung.',
    topics: [
      { id: 'roadClassification_tarmac', defaultActive: true },
      { id: 'bikelanes', defaultActive: false },
      { id: 'surface_tarmac', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: false },
    ],
  },
  {
    id: 'roadClassificationZes',
    name: 'Straßentypen',
    desc: 'Darstellung des Straßenlandes anhand von Klassifizierungskriterien zur Radnetzplanung.',
    topics: [
      { id: 'roadClassification_tarmac', defaultActive: true },
      { id: 'roadClassification_osmscripts', defaultActive: false },
      { id: 'bikelanes', defaultActive: false },
      { id: 'bikelanes_osmscripts', defaultActive: false },
      { id: 'surface_tarmac', defaultActive: false },
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
      { id: 'surface_tarmac', defaultActive: true },
      { id: 'bikelanes', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: true },
    ],
  },
  {
    id: 'surfaceZes',
    name: 'Oberflächen',
    desc: 'Darstellung der Oberflächenqualität des Straßenlades für Auto-, Rad- und Fußverkehr',
    topics: [
      { id: 'surface_tarmac', defaultActive: true },
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
      { id: 'surface_tarmac', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: true },
    ],
  },
  {
    id: 'lit',
    name: 'Beleuchtung',
    desc: 'Darstellung der Beleuchtung im Straßenland für Auto-, Rad- und Fußverkehr',
    topics: [
      { id: 'lit', defaultActive: true },
      { id: 'surface_tarmac', defaultActive: false },
      { id: 'places', defaultActive: true },
      { id: 'landuse', defaultActive: true },
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
