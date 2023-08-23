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
    id: 'fromToZes',
    name: 'Quellen & Ziele ZES',
    desc: 'Darstellung von häufigen Start- und Zielpunkten für die Radnetzplanung.',
    // TODO We will likely want overwrites per region. In this case, we might want to move the relation region>theme>topic inside the region so we can specify theme+topic on region level.
    topics: [
      { id: 'shops', defaultStyle: 'default' },
      { id: 'shops_osmscripts', defaultStyle: 'hidden' },
      { id: 'education', defaultStyle: 'default' },
      { id: 'education_osmscripts', defaultStyle: 'hidden' },
      { id: 'publicTransport', defaultStyle: 'default' },
      { id: 'publicTransport_osmscripts', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'roadClassification', defaultStyle: 'hidden' },
      { id: 'roadClassification_osmscripts', defaultStyle: 'hidden' },
      { id: 'landuse', defaultStyle: 'default' },
    ],
  },
  {
    id: 'roadClassification',
    name: 'Straßentypen',
    desc: 'Darstellung des Straßenlandes anhand von Klassifizierungskriterien zur Radnetzplanung.',
    topics: [
      { id: 'roadClassification', defaultStyle: 'default' },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'maxspeed', defaultStyle: 'hidden' },
      { id: 'surfaceQuality', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'roadClassificationZes',
    name: 'Straßentypen ZES',
    desc: 'Darstellung des Straßenlandes anhand von Klassifizierungskriterien zur Radnetzplanung.',
    topics: [
      { id: 'roadClassification', defaultStyle: 'default' },
      { id: 'roadClassification_osmscripts', defaultStyle: 'hidden' },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'bikelanes_osmscripts', defaultStyle: 'hidden' },
      // { id: 'surface_tarmac', defaultStyle: "hidden" },
      { id: 'surface_osmscripts', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'default' },
    ],
  },
  {
    id: 'bikelanes',
    name: 'Radinfrastruktur',
    desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
    topics: [
      { id: 'bikelanes', defaultStyle: 'default' },
      { id: 'bikelanesPresence', defaultStyle: 'hidden' },
      // { id: 'surface_tarmac', defaultStyle: "hidden" },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'hidden' },
    ],
  },
  {
    id: 'bikelanesZes',
    name: 'Infrastruktur ZES',
    desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
    topics: [
      { id: 'bikelanes', defaultStyle: 'default' },
      { id: 'bikelanesPresence', defaultStyle: 'hidden' },
      { id: 'bikelanes_osmscripts', defaultStyle: 'hidden' },
      // { id: 'surface_tarmac', defaultStyle: "hidden" },
      { id: 'surface_osmscripts', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'default' },
    ],
  },

  {
    id: 'surface',
    name: 'Oberflächen',
    desc: 'Darstellung der Oberflächenqualität des Straßenlades für Auto-, Rad- und Fußverkehr',
    topics: [
      // { id: 'surface_tarmac', defaultStyle: "default" },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'default' },
    ],
  },
  {
    id: 'surfaceZes',
    name: 'Oberflächen ZES',
    desc: 'Darstellung der Oberflächenqualität des Straßenlades für Auto-, Rad- und Fußverkehr',
    topics: [
      // { id: 'surface_tarmac', defaultStyle: "default" },
      { id: 'surface_osmscripts', defaultStyle: 'hidden' },
      { id: 'bikelanes', defaultStyle: 'hidden' },
      { id: 'bikelanes_osmscripts', defaultStyle: 'hidden' },
      { id: 'places', defaultStyle: 'default' },
      { id: 'landuse', defaultStyle: 'default' },
    ],
  },
  {
    id: 'parking',
    name: 'Parkraum',
    desc: 'Auswertung zum Parken im Straßenraum',
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
    desc: 'Darstellung der Beleuchtung im Straßenland für Auto-, Rad- und Fußverkehr',
    topics: [
      { id: 'lit', defaultStyle: 'default' },
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
