export const advisory_or_exclusive = {
  id: 'advisory_or_exclusive',
  title: 'Schutzstreifen oder Angebotsstreifen?',
  pubDate: '2025-01-01T15:00',
  category: 'radinfra',
  recommendedAction: 'maproulette',
  visibility: 'secondary',
  description:
    'Diese Kampagne enthält Radinfrastruktur auf der Fahrbahn bei der die Angabe fehlt, ob es sich um einen Schutzstreifen oder Angebotsstreifen handelt.',
  task: '**Bitte prüfe die Radinfrastruktur und ergänze die nötigen Attribute.** Weitere Hinweise findet Du in der Aufgabenbeschreibung.',
  mapUrl: 'https://radverkehrsatlas.de/regionen/radinfra?config=ife2uk.6rt0.f6&v=2',
  maprouletteChallenge: {
    enabled: true,
    id: 50888,
    checkinComment: 'Angabe zur Führungsform ergänzt (Schutzstreifen oder Angebotsstreifen).',
    checkinSource: 'radinfra_de',
    resultsLimited: false,
    rebuildAt: '2025-02-14T12:51',
  },
  taskTemplate: `
Für diese Infrastruktur fehlen uns Angaben, um sie als Schutzstreifen oder Radfahrstreifen einzutragen.

## Aufgabe

Bitte präzisiere das Tagging.
* Für Schutzstreifen, füge \`advisory\` hinzu, also
   \`cycleway:both:lane=advisory\` (beide Seiten) oder
   \`cycleway:left:lane=advisory\` (linke Seite) oder
   \`cycleway:right:lane=advisory\` (rechte Seite)
* Für Radfahrstreifen, füge \`exclusive\` hinzu., also
   \`cycleway:both:lane=exclusive\` (beide Seiten) oder
   \`cycleway:left:lane=exclusive\` (linke Seite) oder
   \`cycleway:right:lane=exclusive\` (rechte Seite)
* [Mehr im OSM Wiki…](https://wiki.openstreetmap.org/wiki/Key:cycleway:lane)

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](%%MAPILLARY_URL_START%%)
* [Mapillary-Link vom Ende der Straße](%%MAPILLARY_URL_END%%)
* [Radverkehrsatlas an dieser Stelle](%%ATLAS_URL%%)
* [OpenStreetMap](%%OSM_URL%%)
`,
}
