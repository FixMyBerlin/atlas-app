export const malformed_traffic_sign = {
  id: 'malformed_traffic_sign',
  title: 'Fehler im Verkehrszeichen-Tag',
  pubDate: '2025-02-17T10:00',
  category: 'traffic_signs',
  recommendedAction: 'maproulette',
  visibility: 'secondary',
  description: 'Diese Kampagne enthält Wege mit einem Fehler im Wert des `traffic_sign*`-Tags',
  task: '**Bitte prüfe und korrigiere den Wert der Tags `traffic_sign`, `traffic_sign:forward`, `traffic_sign:backward`.** Weitere Hinweise findet Du in der Aufgabenbeschreibung.',
  mapUrl: 'https://radverkehrsatlas.de/regionen/radinfra?config=v92cax.27xwlg.3dc&v=2',
  maprouletteChallenge: {
    enabled: true,
    id: 51092,
    checkinComment: '`traffic_sign:*` korrigiert.',
    checkinSource: 'radinfra_de',
    resultsLimited: false,
    rebuildAt: '2025-02-18T10:54',
  },
  taskTemplate: `
Das Verkehrszeichen-Tag an diese Weg enthält einen Fehler.

## Aufgabe

**Bitte prüfe und korrigiere den Wert der Tags \`traffic_sign\`, \`traffic_sign:forward\`, \`traffic_sign:backward\`.**

* [Das Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/DE) hilft, den richtigen Wert zu finden
* Häufig sind es Tippfehler bei \`DE:\` oder zusätzliche Leerzeichen zwischen den Trennzeichen \`,\` und \`;\`. Auch Großschreibung wird geprüft.
* Es werden auch "verschachtelte" Tags geprüft wie zum Beispiel \`cycleway:right:traffic_sign\`

## Hilfsmittel

* [OpenStreetMap](%%OSM_URL%%)
* [Mapillary-Link vom Anfang der Straße](%%MAPILLARY_URL_START%%)
* [Mapillary-Link vom Ende der Straße](%%MAPILLARY_URL_END%%)
* [Radverkehrsatlas an dieser Stelle](%%ATLAS_URL%%)
`,
}
