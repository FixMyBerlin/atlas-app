import { MapDataConfigTheme } from '../types'

// TODO type MapDataConfigThemeIds = typeof sources[number]['id']
export type MapDataConfigThemeIds =
  | 'fromTo'
  | 'bikelanes'
  | 'highwayClassification'
  | 'surface'
  | 'parking'

export const themes: MapDataConfigTheme[] = [
  {
    id: 'fromTo',
    name: 'Quellen & Ziele',
    desc: 'Darstellung von häufigen Start- und Zielpunkten für die Radnetzplanung.',
    // TODO see mapDataConfigTopicsWithState
    // topics: [{ id: 'foo' }],
  },
  {
    id: 'bikelanes',
    name: 'Infrastruktur',
    desc: 'Darstellung der Führungsformen bestehender Radinfrastruktur sowie des umliegenden Straßenlandes.',
  },
  {
    id: 'highwayClassification',
    name: 'Straßentypen',
    desc: 'Darstellung des Straßenlandes anhand von Klassifizierungskriterien zur Radnetzplanung.',
  },
  {
    id: 'surface',
    name: 'Oberflächen',
    desc: 'Darstellung der Oberflächenqualität des Straßenlades für Auto-, Rad- und Fußverkehr',
  },
  {
    id: 'parking',
    name: 'Parkraum',
    desc: 'Auswertung zum Parken im Straßenraum',
  },
]
