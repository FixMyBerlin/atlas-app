export type StaticDatasetCategoryKey = keyof typeof staticDatasetCategories

export const staticDatasetCategories = {
  'bb/Netzkonzeption': {
    order: 1,
    title: 'Netzentwicklung Land',
    subtitle: 'Statische Daten zur Entwicklung des Radnetzes für Brandenburg',
  },
  'bb/Beteiligung': {
    order: 1.5,
    title: 'Beteiligung',
    subtitle: 'Aktuelle Beteiligungsbeiträge',
  },
  'bb/Bestandsdaten': {
    order: 2,
    title: 'Bestandsdaten',
    subtitle: 'Statische Daten zur vorhandenen Radinfrastruktur',
  },
  'bb/Radnetze': {
    order: 3,
    title: 'Radnetze und Routen',
    subtitle:
      'Statische Daten zu vorhandenen Radnetzen, touristischen Routen, Bedarfen und Planungen',
  },
  'bb/Landesdaten': {
    order: 4,
    title: 'Weitere Daten',
    subtitle: 'Weitere statische Daten',
  },
  'bibi/Radverkehr': {
    order: 1,
    title: 'Radverkehr',
    subtitle: 'Statische Daten zum Radverkehr',
  },
  'bibi/Parkraum': {
    order: 2,
    title: 'Parkraum',
    subtitle: 'Statische Daten zum Parkraum',
  },
  'nudafa/general': {
    order: 1,
    title: 'Statisch Daten',
    subtitle: 'Statische Daten',
  },
  'nudafa/website': {
    order: 2,
    title: 'Daten für nudafa.de',
    subtitle: 'Statische Daten die auf nudafa.de verwendet werden.',
  },
  'radplus/fahrten': {
    order: 1,
    title: 'Rad+ Fahrten',
    subtitle: 'Statische Daten der Fahrten von Rad+ Nutzer:innen.',
  },
  'radplus/radparken': {
    order: 2,
    title: 'radparken.info',
    subtitle: 'Statische Daten der radparken.info Umfragen.',
  },
  'parkraum/euvm': {
    order: 1,
    title: 'Parkflächen eUVM-Projekt',
    subtitle: 'Statische Daten aus dem Parkflächen eUVM-Projekt.',
  },
  'parkraum/misc': {
    order: 2,
    title: 'Weitere Daten',
    subtitle: 'Weitere statische Daten.',
  },
} as const
