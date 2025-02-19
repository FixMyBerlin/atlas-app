export const missing_width = {
  id: 'missing_width',
  title: 'Ergänze Angaben zur Breite',
  pubDate: '2025-01-01T15:00',
  category: 'width',
  recommendedAction: 'streetcomplete',
  visibility: 'secondary',
  description:
    'Diese Karte zeigt Wege, bei denen die Angabe zur Breite der Radinfrastruktur fehlt.',
  task: '**Bitte ergänze die Breite der Radinfrastruktur `width`.**',
  mapUrl: 'https://radverkehrsatlas.de/regionen/radinfra?config=ife2uk.8vo5z8.f6&v=2',
  maprouletteChallenge: {
    enabled: false,
  },
  taskTemplate: `
Diesem Weg fehlt eine Angabe zur Breite.

## Aufgabe

**Bitte ergänze die Breitenangabe.**

* Nutze \`width\`, wenn du die Breite ausmessen kannst. Das geht mit einem Metermaß oder einer Handy-App.
* Nutze \`est_width\`, wenn du nur einen Schätzwert eintragen kannst.

Tipp: Android Nutzer:innen empfehlen wir [StreetComplete](https://streetcomplete.app/). Dort ist ein Messgerät direkt eingebaut.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](%%MAPILLARY_URL_START%%)
* [Mapillary-Link vom Ende der Straße](%%MAPILLARY_URL_END%%)
* [Radverkehrsatlas an dieser Stelle](%%ATLAS_URL%%)
* [OpenStreetMap](%%OSM_URL%%)
`,
}
