export type StaticDatasetCategoryKey = keyof typeof staticDatasetCategories

export const staticDatasetCategories = {
  'bb/Bestandsdaten': {
    title: 'Netzentwicklung Land',
    subtitle: 'Statische Daten zur Entwicklung des Radnetz für Brandenburg',
  },
  'bb/Radnetze': {
    title: 'Bestandsdaten',
    subtitle: 'Statische Daten zur vorhandenen Radinfrastruktur ',
  },
  'bb/Netzkonzeption': {
    title: 'Radnetze und Route',
    subtitle:
      'Statische Daten zu vorhandenen Radnetzen, touristischen Routen, Bedarfen und Planungen',
  },
  'bb/Landesdaten': {
    title: 'Weitere Daten',
    subtitle: 'Weitere Statische Daten',
  },
} as const
