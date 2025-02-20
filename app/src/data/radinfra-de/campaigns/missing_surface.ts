export const missing_surface = {
  id: 'missing_surface',
  title: 'Ergänze Angaben zur Oberfläche',
  pubDate: '2025-01-01T15:00',
  category: 'surface',
  recommendedAction: 'streetcomplete',
  visibility: 'secondary',
  description: 'Diese Karte zeigt Wege, bei denen die Angabe zur Oberfläche fehlt.',
  task: '**Bitte ergänze die Oberfläche `surface` und gerne auch die Oberflächenqualität `smoothness`.**',
  mapUrl: 'https://radverkehrsatlas.de/regionen/radinfra?config=ife2uk.k0cbo.f6&v=2',
  maprouletteChallenge: {
    enabled: false,
  },
  taskTemplate: `
Diesem Weg fehlt eine Angabe zur Oberfläche.

## Aufgabe

**Bitte ergänze die Angabe zur Oberfläche** und gerne auch zur Oberflächenqualität.**

* Nutze \`surface\` um die Oberfläche zu beschreiben. [Zum Wiki](https://wiki.openstreetmap.org/wiki/DE:Key:surface)
* Nutze \`smoothness\` um die Oberflächenqualität zu beschreiben. Dieser Wert ist subjektiver, bitte orientiere dich an den [Beispielen im Wiki](https://wiki.openstreetmap.org/wiki/DE:Key:smoothness) und [in dieser Gallerie](https://wiki.openstreetmap.org/wiki/Key:smoothness/Gallery).

Tipp: Android Nutzer:innen empfehlen wir [StreetComplete](https://streetcomplete.app/). Dort findet du gute Beispielbilder, was die Erfassung vereinfacht.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](%%MAPILLARY_URL_START%%)
* [Mapillary-Link vom Ende der Straße](%%MAPILLARY_URL_END%%)
* [Radverkehrsatlas an dieser Stelle](%%ATLAS_URL%%)
* [OpenStreetMap](%%OSM_URL%%)
`,
}
