export type SourcesListKeys = keyof typeof sourcesList

export const sourcesList = {
  parkingLanes: { displayName: 'Parkraum', desc: '(Parkraum Projekt Lars)' },
  unfallatlas: {
    displayName: 'Unfälle',
    desc: 'Externe Daten; aufbereitet.',
  },
  boundaries: { displayName: 'Grenzen', desc: '(Parkraum Projekt Lars)' },
  barriers: {
    displayName: 'Barrieren',
    desc: '(Tarmac Daten) Hindernisse für Radinfrastruktur (Fluß, Bahn, Autobah, Flughafen, …)',
  },
  landuse: { displayName: 'Landnutzung', desc: '(Tarmac Daten)' },
  maxspeed: { displayName: 'Geschwindigkeit', desc: '(Tarmac Daten)' },
  oberflaechenqualitaet: {
    displayName: 'Oberflächenqualität',
    desc: '(Tarmac Daten)',
  },
  'surface-bad': {
    displayName: 'Oberflächenqualität Schlecht',
    desc: '(Tarmac Daten) TODO ist eine Visualsierung, kein "Thema"',
  },
  poi: { displayName: 'POI', desc: '(Tarmac Daten)' },
  radinfra: { displayName: 'Radinfrastruktur', desc: '(Tarmac Daten)' },
  settlements: { displayName: 'Orte', desc: '(Tarmac Daten)' },
  strassentypen: { displayName: 'Straßentypen', desc: '(Tarmac Daten)' },
}
