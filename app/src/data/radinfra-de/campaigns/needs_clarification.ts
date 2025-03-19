export const needs_clarification = {
  id: 'needs_clarification',
  title: 'Führungsform unklar',
  pubDate: '2025-01-01T15:00',
  category: 'radinfra',
  recommendedAction: 'maproulette',
  visibility: 'promote',
  description:
    'Diese Kampagne enthält Radinfrastruktur, die nicht eindeutig kategorisiert werden konnte.',
  task: '**Bitte prüfe das Tagging und ergänze weitere Attribute, die bei der Kategorisierung helfen.** Weitere Hinweise findet Du in der Aufgabenbeschreibung.',
  mapUrl: 'https://tilda-geo.de/regionen/radinfra?config=ife2uk.2j1vo.f6&v=2',
  maprouletteChallenge: {
    enabled: true,
    id: 50891,
    checkinComment: 'Angabe zur Führungsform ergänzt.',
    checkinSource: 'radinfra_de',
    resultsLimited: false,
  },
  taskTemplate: `
Diese Radinfrastruktur konnte nicht richtig kategorisiert werden.

Das passiert häufig, wenn der Weg als \`highway=cycleway\` ohne weitere Attribute angegeben ist.

## Aufgabe

Bitte präzisiere das Tagging.
* Bitte versuch als erstes das Verkehrszeichen zu ergänzen ([Tagging-Hilfe](https://trafficsigns.osm-verkehrswende.org/)) oder ein explizites \`traffic_sign=none\`.
* Ist es ein Übergang an einer Straße? ➔ Füge \`cycleway=crossing\` oder \`path=crossing\` hinzu.
* Ist es ein Verbindungsstück das nur für das Routing relevant ist? ➔ Füge \`cycleway=link\` hinzu.
* Ist es ein gemeinsamer oder getrennter Geh- und Radweg? ➔ Füge \`segregated=yes\` oder  \`segregated=no\` hinzu.
* Ist es ein Radweg \`highway=cycleway\`? ➔ Ergänze \`is_sidepath=yes\` für straßenbegleitende Wege bzw. \`no\` für selbständig geführte Wege.

Weitere tipps zu passenden Tags findest du [im Wiki](https://wiki.openstreetmap.org/wiki/DE:Bicycle/Radverkehrsanlagen_kartieren#Stra%C3%9Fenbegleitende_Wege) und in [der Dokumentation](https://radinfra.de/dokumentation/fuehrungsform) der Prozessierung.

Wenn du ein aussagekräftiges Foto in Mapillary siehst, füge es als \`mapillary=IMAGE_KEY\` hinzu.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](%%MAPILLARY_URL_START%%)
* [Mapillary-Link vom Ende der Straße](%%MAPILLARY_URL_END%%)
* [TILDA Radverkehr an dieser Stelle](%%ATLAS_URL%%)
* [OpenStreetMap](%%OSM_URL%%)
`,
}
