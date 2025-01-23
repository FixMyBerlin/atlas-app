import { translations } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/TagsTable/translations/translations.const'
import { mapillaryUrl } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { pointFromGeometry } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/pointFromGeometry'
import { TodoId, todoIds } from '@/src/processingTypes/todoId'
import { point } from '@turf/turf'
import { LineString } from 'geojson'

type Props = {
  projectKey: TodoId
  osmTypeIdString: string
  bikelaneCategory: string | undefined
  geometry: LineString
}

export const todoMarkdownToMaprouletteCampaignKey = (todos: string | undefined) => {
  return todoIds.map((project) => {
    if (todos?.includes(`* ${project}`)) {
      return project
    }
  })
}

export const maprouletteTaskDescriptionMarkdown = ({
  projectKey,
  osmTypeIdString,
  bikelaneCategory,
  geometry,
}: Props) => {
  const [centerLng, centerLat] = pointFromGeometry(geometry)
  const startPoint = point(geometry.coordinates[0]!).geometry
  const endPoint = point(geometry.coordinates.at(-1)!).geometry

  const infrastructureName = translations[`ALL--category=${bikelaneCategory}`]
    ?.replace('(Straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)', '')
    ?.replace('(Kategorisierung unklar)', '')

  // Do not add indentation, it will break the Markdown in Maproulette
  // Use in MapRoulette as… (min 150 chars)
  /*
    ```
{{task_markdown}}



. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    ```
    */
  switch (projectKey) {
    case 'adjoiningOrIsolated':
      return `
## Kontext

Für diese Infrastruktur (${infrastructureName}) fehlt uns eine Angabe ob sie straßenbegleitend ist (oder nicht).

## Aufgabe

Bitte präzisiere das Tagging.
* Ist die Infrastruktur ein Gehweg? Dann wähle "Gehweg" als Typ aus oder füge \`footway=sidepath\` hinzu.
* Ist die Infrastruktur ein Radweg oder geteilter/gemeinsamer Geh- und Radweg? Dann ergänze bitte \`is_sidepath=yes\` wenn der Weg straßenbegleitend ist oder \`is_sidepath=no\` für selbständig/frei geführt Wege.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})

`
    case 'advisoryOrExclusive':
      return `
## Kontext

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

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, panos: true, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})

`
    case 'needsClarification':
      return `
## Kontext

Diese Radinfrastruktur konnte nicht richtig kategorisiert werden.
Es ist ein \`highway=cycleway\` oder ein \`highway=path+bicycle=designated\` ohne weitere Attribute.

## Aufgabe

Bitte präzisiere das Tagging.
* Ist es ein Übergang an einer Straße? Füge \`cycleway=crossing\` oder \`path=crossing\` hinzu.
* Ist es ein Verbindungsstück das nur für das Routing relevant ist? Füge \`cycleway=link\` hinzu.
* Ist es ein gemeinsamer oder getrennter Geh- und Radweg? Fürge \`segregated=yes\` oder  \`segregated=no\` hinzu.
* Wenn möglich, ergänze bitte auch \`is_sidepath=yes|no\` um anzuzeigen, ob die Infrastruktur straßenbegleitend (\`yes\`) oder selbständig geführt (\`no\`) ist (bzw. bei Gehwegen stattdessen \`footway=sidepath\`).
* Wenn möglich, ergänze bitte auch das Verkehrszeichen ([Tagging-Hilfe](https://trafficsigns.osm-verkehrswende.org/)).
* Wenn du ein aussagekräftiges Foto in Mapillary siehst, füge es als \`mapillary=IMAGE_KEY\` hinzu.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, panos: true, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})

`
    case 'missing_traffic_sign_244':
      return `
## Kontext

Dieser Weg ist als Fahrradstraße getaggt, **jedoch fehlt der zugehörige Verkehrszeichen-Tag.**

## Aufgabe

Bitte ergänze das Verkehrszeichen an der Straßenlinie:

* \`traffic_sign=DE:244.1\`, wenn es eine "echte" Fahrradstraße ohne Kfz-Verkehr.
* \`traffic_sign=DE:244.1,1020-30\`, wenn es Fahrradstraße mit "Anlieger Frei" ist.

Ergänze gerne auch einen \`mapillary=*\` Tag auf dem das Verkehrszeichen zu sehen ist.

Andere Zusatzzeichen kannst du beispielsweise [im Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/?signs=DE:244.1) oder [im Wiki](https://wiki.openstreetmap.org/wiki/DE:Tag:bicycle_road%3Dyes#Zusatzzeichen) finden.

Wenn wirklich kein Verkehrszeichen existiert, tagge \`traffic_sign=none\`, um diese Information explizit zu erfassen.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, panos: true, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})

`
    case 'missing_traffic_sign_vehicle_destination':
      return `
## Kontext

Dieser Weg ist als Fahrradstraße mit Freigabe für Kfz getaggt, **jedoch fehlt der zugehörige Verkehrszeichen-Tag (Zusatzzeichen).**

## Aufgabe

Bitte ergänze oder erweitere das Verkehrszeichen an der Straßenlinie:

* \`traffic_sign=DE:244.1,1020-30\`, wenn es Fahrradstraße mit "Anlieger Frei" ist. Dazu gehört dann für Fahrzeuge \`destination\`.
* \`traffic_sign=DE:244.1\`, wenn es eine "echte" Fahrradstraße ohne Kfz-Verkehr ist. Dazu gehört dann für Fahrzeuge \`no\`.
* Andere Zusatzzeichen kannst du beispielsweise [im Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/?signs=DE:244.1) oder [im Wiki](https://wiki.openstreetmap.org/wiki/DE:Tag:bicycle_road%3Dyes#Zusatzzeichen) finden.

Wenn wirklich kein Verkehrszeichen existiert, tagge \`traffic_sign=none\`, um diese Information explizit zu erfassen.

Ergänze gerne auch einen \`mapillary=*\` Tag auf dem das Verkehrszeichen zu sehen ist.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, panos: true, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})

Wenn keine Änderung nötig ist, ergänze gerne einen \`check_date=*\` Tag um zu signalisieren, dass alle Tags geprüft wurden und aktuell sind. Das hilft bei der Auswertung.

`
    case 'missing_access_tag_bicycle_road':
      return `
## Kontext

Dieser Weg ist als Fahrradstraße getaggt **ohne das zugehörige \`bicycle=designated\`.** Ohne diesen Zusatz können Router nicht erkennen, dass die Straße für den Radverkehr freigegeben ist.

## Aufgabe

Bitte ergänze den Access-Tag \`bicycle=designated\` an der Straßenlinie:

Nutze gerne die Gelegenheit, um auch die übrigen Tags der Fahrradstraße zu prüfen. Hinweise zum Tagging geben [das Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/?signs=DE:244.1) und [das Wiki](https://wiki.openstreetmap.org/wiki/DE:Tag:bicycle_road%3Dyes#Zusatzzeichen).

Ergänze gerne auch einen \`mapillary=*\` Tag auf dem das Verkehrszeichen zu sehen ist.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, panos: true, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})


Wenn keine Änderung nötig ist, ergänze gerne einen \`check_date=*\` Tag um zu signalisieren, dass alle Tags geprüft wurden und aktuell sind. Das hilft bei der Auswertung.

`
    case 'missing_traffic_sign':
      return `
## Kontext

Für diese Infrastruktur ist kein Verkehrszeichen-Tag hinterlegt. Gerade für Fuß- und Fahrrad-Infrastruktur ist es sehr hilfreich, das Verkehrszeichen explizit zu erfassen.

## Aufgabe

**Bitte ergänze das Verkehrszeichen am Weg.**

1. Prüfe mit Mapillary (s.u.) oder vor Ort, welches Verkehrszeichen vorliegt.
   Ideal ist, wenn du über den \`mapillary=*\` Tag den Mapillary-Key von einem Foto hinterlegst, auf dem das Verkehrszeichen zu sehen ist.

2. Nutze beispielsweise [das Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/) umd Tagging-Empfehlungen zu erhalten und ergänze den \`traffic_sign=*\` Tag.

3. Wenn kein Verkehrszeichen existiert, tagge \`traffic_sign=none\`, um diese Information explizit zu erfassen. Das hilft bei zukünftigen Auswertungen.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, panos: true, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})

`
    case 'unexpected_bicycle_access_on_footway':
      return `
## Kontext

Dieser Weg verwendet eine unerwarte Kombination an Tags: Er ist als Gehweg attributiert aber gleichzeitig als für Fahrrad vorgesehen Infrastruktur.

## Aufgabe

**Bitte prüfe und korrigieren die Tags.**

Prüfe mit Mapillary (s.u.) oder vor Ort, welches Verkehrszeichen vorliegt.
Ideal ist, wenn du über den \`mapillary=*\` Tag den Mapillary-Key von einem Foto hinterlegst, auf dem das Verkehrszeichen zu sehen ist:

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, panos: true, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, trafficSign: 'all' })})

Tagging-Empfehlungen:

* Ist es ein **"Gehweg + Fahrrad frei"**? Dann ändere \`bicycle=yes\` und ergänze [das Verkehrszeichen](https://trafficsigns.osm-verkehrswende.org/?signs=DE:239,DE:1022-10) \`traffic_sign=DE:239,1022-10\`.

* Ist es ein **"Gemeinsamer Geh- und Radweg"**? Dann ändere \`highway=path\` und ergänze [das Verkehrszeichen](https://trafficsigns.osm-verkehrswende.org/?signs=DE:240) \`traffic_sign=DE:240\`.

* Ist es ein **unbeschildeter Weg**? Dann wähle eine der Tagging kombinationen anhand der Verkehrsbedeutung vor Ort und ergänze \`traffic_sign=none\`.

## Hilfsmittel

* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})

`
  }
}
