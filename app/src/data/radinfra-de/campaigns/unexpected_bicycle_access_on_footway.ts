export const unexpected_bicycle_access_on_footway = {
  id: 'unexpected_bicycle_access_on_footway',
  title: 'Straßenklasse Fußweg unerwartet',
  pubDate: '2025-01-01T15:00',
  category: 'radinfra',
  recommendedAction: 'maproulette',
  visibility: 'secondary',
  description:
    'Diese Kampagne enthält Fußwege, die gleichzeitig Angaben zur Radinfrastruktur haben.',
  task: '**Bitte prüfe das Tagging. Eventuell ist eine andere Straßenklasse angebracht.** Weitere Hinweise findet Du in der Aufgabenbeschreibung.',
  mapUrl: 'https://radverkehrsatlas.de/regionen/radinfra?config=ife2uk.50y84.f6&v=2',
  maprouletteChallenge: {
    enabled: true,
    id: 50883,
    checkinComment: 'Straßenklasse Fußweg in Kombination mit Radinfrastruktur verbessert.',
    checkinSource: 'radinfra_de',
    resultsLimited: false,
  },
  taskTemplate: `
Dieser Weg verwendet eine unerwarte Kombination an Tags: Er ist als Gehweg attributiert aber gleichzeitig als für Fahrrad vorgesehen Infrastruktur.

## Aufgabe

**Bitte prüfe und korrigieren die Tags.**

Prüfe mit Mapillary (s.u.) oder vor Ort, welches Verkehrszeichen vorliegt.
Ideal ist, wenn du über den \`mapillary=*\` Tag den Mapillary-Key von einem Foto hinterlegst, auf dem das Verkehrszeichen zu sehen ist:

* [Mapillary-Link vom Anfang der Straße](%%MAPILLARY_URL_START%%)
* [Mapillary-Link vom Ende der Straße](%%MAPILLARY_URL_END%%)

Tagging-Empfehlungen:

* Ist es ein **"Gehweg + Fahrrad frei"**? Dann ändere \`bicycle=yes\` und ergänze [das Verkehrszeichen](https://trafficsigns.osm-verkehrswende.org/?signs=DE:239,DE:1022-10) \`traffic_sign=DE:239,1022-10\`.

* Ist es ein **"Gemeinsamer Geh- und Radweg"**? Dann ändere \`highway=path\` und ergänze [das Verkehrszeichen](https://trafficsigns.osm-verkehrswende.org/?signs=DE:240) \`traffic_sign=DE:240\`.

* Ist es ein **unbeschildeter Weg**? Dann wähle eine der Tagging kombinationen anhand der Verkehrsbedeutung vor Ort und ergänze \`traffic_sign=none\`.

## Hilfsmittel

* [Radverkehrsatlas an dieser Stelle](%%ATLAS_URL%%)
* [OpenStreetMap](%%OSM_URL%%)
`,
}
