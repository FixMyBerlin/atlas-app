export type StaticDatasetCategoryKey = keyof typeof staticDatasetCategories

export const staticDatasetCategories = {
  'bb/Netzkonzeption': {
    title: 'Netzentwicklung Land',
    subtitle: 'Statische Daten zur Entwicklung des Radnetzes für Brandenburg',
  },
  'bb/Bestandsdaten': {
    title: 'Bestandsdaten',
    subtitle: 'Statische Daten zur vorhandenen Radinfrastruktur',
  },
  'bb/Radnetze': {
    title: 'Radnetze und Routen',
    subtitle:
      'Statische Daten zu vorhandenen Radnetzen, touristischen Routen, Bedarfen und Planungen',
  },
  'bb/Landesdaten': {
    title: 'Weitere Daten',
    subtitle: 'Weitere statische Daten',
  },
} as const
