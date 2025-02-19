import { translations } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/TagsTable/translations/translations.const'
import { mapillaryUrl } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { pointFromGeometry } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/pointFromGeometry'
import { TodoId, todoIds } from '@/src/data/processingTypes/todoIds.const'
import { point } from '@turf/turf'
import { LineString } from 'geojson'

type Props = {
  projectKey: TodoId
  osmTypeIdString: string
  /** `bikelane.category` or `roads.road` */
  kind: string
  geometry: LineString
}

export const todoMarkdownToMaprouletteCampaignKey = (todos: string | undefined) => {
  return todoIds
    .map((project) => {
      if (todos?.includes(`* ${project}\n`)) {
        return project
      }
    })
    .filter(Boolean)
}

export const maprouletteTaskDescriptionMarkdown = ({
  projectKey,
  osmTypeIdString,
  kind,
  geometry,
}: Props) => {
  const [centerLng, centerLat] = pointFromGeometry(geometry)
  const startPoint = point(geometry.coordinates[0]!).geometry
  const endPoint = point(geometry.coordinates.at(-1)!).geometry

  const infrastructureName = translations[`ALL--category=${kind}`]
    ?.replace('(Straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)', '')
    ?.replace('(Kategorisierung unklar)', '')
    ?.trim()

  // Do not add indentation, it will break the Markdown in Maproulette
  // REMINDER: This is not the full text. This just what is added to MR with `{task_markdown}`
  //           Some other parts are added by the default instructions when we create/update the challenge.
  //           This is done because we need to use Mustache tags for some features which cannot be part of this string.
  switch (projectKey) {
    case 'adjoining_or_isolated':
      return `
Für diese Infrastruktur (${infrastructureName}) fehlt uns eine Angabe, ob sie straßenbegleitend ist (oder nicht).

## Aufgabe

Bitte präzisiere das Tagging.
* Ist die Infrastruktur ein Radweg oder geteilter/gemeinsamer Geh- und Radweg? Dann ergänze bitte \`is_sidepath=yes\`, wenn der Weg straßenbegleitend ist oder \`is_sidepath=no\` für selbständig/frei geführt Wege.
* Ist die Infrastruktur ein Gehweg? Dann wähle "Gehweg" als Typ aus oder füge \`footway=sidepath\` hinzu.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'advisory_or_exclusive':
      return `
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

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'needs_clarification':
      return `
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

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'missing_traffic_sign_244':
      return `
Dieser Weg ist als Fahrradstraße getaggt, **jedoch fehlt der zugehörige Verkehrszeichen-Tag.**

## Aufgabe

Bitte ergänze das Verkehrszeichen an der Straßenlinie:

* \`traffic_sign=DE:244.1\`, wenn es eine "echte" Fahrradstraße ohne Kfz-Verkehr.
* \`traffic_sign=DE:244.1,1020-30\`, wenn es Fahrradstraße mit "Anlieger Frei" ist.

Ergänze gerne auch einen \`mapillary=*\` Tag auf dem das Verkehrszeichen zu sehen ist.

Andere Zusatzzeichen kannst du beispielsweise [im Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/?signs=DE:244.1) oder [im Wiki](https://wiki.openstreetmap.org/wiki/DE:Tag:bicycle_road%3Dyes#Zusatzzeichen) finden.

Wenn wirklich kein Verkehrszeichen existiert, tagge \`traffic_sign=none\`, um diese Information explizit zu erfassen.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'missing_access_tag_240':
      return `
Für diesen Weg wurde das Verkehrszeichen \`240\` oder \`241\` angegeben aber ein entsprechendes Zugangs-Taggging fehlt.

## Aufgabe

Bitte prüfe die Infrastruktur und ergänze:

* \`bicycle=designated\` und \`foot=designated\`
* Empfehlungen für [\`240\` Gem. Geh- und Radweg](https://trafficsigns.osm-verkehrswende.org/DE?signs=DE:240)
* Empfehlungen für [\`241\` Getr. Rad- und Gehweg](https://trafficsigns.osm-verkehrswende.org/DE?signs=DE:241-30)

Ergänze gerne auch einen \`mapillary=*\` Tag auf dem das Verkehrszeichen zu sehen ist.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'missing_traffic_sign_vehicle_destination':
      return `
Dieser Weg ist als Fahrradstraße mit Freigabe für Kfz getaggt, **jedoch fehlt der zugehörige Verkehrszeichen-Tag (Zusatzzeichen).**

## Aufgabe

Bitte ergänze oder erweitere das Verkehrszeichen an der Straßenlinie:

* \`traffic_sign=DE:244.1,1020-30\`, wenn es Fahrradstraße mit "Anlieger Frei" ist. Dazu gehört dann für Fahrzeuge \`destination\`.
* \`traffic_sign=DE:244.1\`, wenn es eine "echte" Fahrradstraße ohne Kfz-Verkehr ist. Dazu gehört dann für Fahrzeuge \`no\`.
* Andere Zusatzzeichen kannst du beispielsweise [im Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/?signs=DE:244.1) oder [im Wiki](https://wiki.openstreetmap.org/wiki/DE:Tag:bicycle_road%3Dyes#Zusatzzeichen) finden.

Wenn wirklich kein Verkehrszeichen existiert, tagge \`traffic_sign=none\`, um diese Information explizit zu erfassen.

Ergänze gerne auch einen \`mapillary=*\` Tag auf dem das Verkehrszeichen zu sehen ist.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})

Wenn keine Änderung nötig ist, ergänze gerne einen \`check_date=*\` Tag um zu signalisieren, dass alle Tags geprüft wurden und aktuell sind. Das hilft bei der Auswertung.
`
    case 'missing_access_tag_bicycle_road':
      return `
Dieser Weg ist als Fahrradstraße getaggt **ohne das zugehörige \`bicycle=designated\`.** Ohne diesen Zusatz können Router nicht erkennen, dass die Straße für den Radverkehr freigegeben ist.

## Aufgabe

Bitte ergänze den Access-Tag \`bicycle=designated\` an der Straßenlinie:

Nutze gerne die Gelegenheit, um auch die übrigen Tags der Fahrradstraße zu prüfen. Hinweise zum Tagging geben [das Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/?signs=DE:244.1) und [das Wiki](https://wiki.openstreetmap.org/wiki/DE:Tag:bicycle_road%3Dyes#Zusatzzeichen).

Ergänze gerne auch einen \`mapillary=*\` Tag auf dem das Verkehrszeichen zu sehen ist.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})


Wenn keine Änderung nötig ist, ergänze gerne einen \`check_date=*\` Tag um zu signalisieren, dass alle Tags geprüft wurden und aktuell sind. Das hilft bei der Auswertung.
`
    case 'missing_traffic_sign':
      return `
Für diese Infrastruktur ist kein Verkehrszeichen-Tag hinterlegt. Gerade für Fuß- und Fahrrad-Infrastruktur ist es sehr hilfreich, das Verkehrszeichen explizit zu erfassen.

## Aufgabe

**Bitte ergänze das Verkehrszeichen am Weg.**

1. Prüfe mit Mapillary (s.u.) oder vor Ort, welches Verkehrszeichen vorliegt.
   Ideal ist, wenn du über den \`mapillary=*\` Tag den Mapillary-Key von einem Foto hinterlegst, auf dem das Verkehrszeichen zu sehen ist.

2. Nutze beispielsweise [das Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/) umd Tagging-Empfehlungen zu erhalten und ergänze den \`traffic_sign=*\` Tag.

3. Wenn kein Verkehrszeichen existiert, tagge \`traffic_sign=none\`, um diese Information explizit zu erfassen. Das hilft bei zukünftigen Auswertungen.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'unexpected_bicycle_access_on_footway':
      return `
Dieser Weg verwendet eine unerwarte Kombination an Tags: Er ist als Gehweg attributiert aber gleichzeitig als für Fahrrad vorgesehen Infrastruktur.

## Aufgabe

**Bitte prüfe und korrigieren die Tags.**

Prüfe mit Mapillary (s.u.) oder vor Ort, welches Verkehrszeichen vorliegt.
Ideal ist, wenn du über den \`mapillary=*\` Tag den Mapillary-Key von einem Foto hinterlegst, auf dem das Verkehrszeichen zu sehen ist:

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})

Tagging-Empfehlungen:

* Ist es ein **"Gehweg + Fahrrad frei"**? Dann ändere \`bicycle=yes\` und ergänze [das Verkehrszeichen](https://trafficsigns.osm-verkehrswende.org/?signs=DE:239,DE:1022-10) \`traffic_sign=DE:239,1022-10\`.

* Ist es ein **"Gemeinsamer Geh- und Radweg"**? Dann ändere \`highway=path\` und ergänze [das Verkehrszeichen](https://trafficsigns.osm-verkehrswende.org/?signs=DE:240) \`traffic_sign=DE:240\`.

* Ist es ein **unbeschildeter Weg**? Dann wähle eine der Tagging kombinationen anhand der Verkehrsbedeutung vor Ort und ergänze \`traffic_sign=none\`.

## Hilfsmittel

* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'missing_segregated':
      return `
Dieser Weg wird vom Fußverkehr und Radverkehr genutzt (laut Verkehrszeichen oder Zugangs-Tagging).

## Aufgabe

**Bitte ergänze die Angabe, ob die Verkehrsformen getrennt oder gemeinsam geführt werden:**

* \`segregated=yes\`, wenn eine Trennung vorliegt, beispielweise durch eine farbige Linie ([Getr. Rad- und Gehweg](https://trafficsigns.osm-verkehrswende.org/DE?signs=DE:241-30))).
* \`segregated=no\`, wenn keine Trennung vorliegt ([Gem. Geh- und Radweg](https://trafficsigns.osm-verkehrswende.org/DE?signs=DE:240)).

Die Angabe, ob ein Verkehrszeichen vorliegt ist unabhängig davon, wie die Infrastruktur vor Ort wahrgenommen wird. In Ausnahmen kann es zu differenzen kommen, wenn das Verkehrszeichen \`241\` eine Trennung angibt aber (Abschnittsweise) keine Trennung zu erkennen ist.

Ergänze gerne auch einen \`mapillary=*\` Tag auf dem das Verkehrszeichen zu sehen ist.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'currentness_too_old':
      return `
Dieser Weg ist seit vielen Jahren nicht mehr überprüft worden.

## Aufgabe

**Bitte prüfe und aktualisiere diese Infrastruktur:**

* Wenn du Tags veränderst, wird automatisch das Datum der letzten Bearbeitung aktualisiert. (Reine Geometrie-Änderungen ändern das Datum dagegen nicht.)
* Wenn bereits alles richtig getaggt ist, ergänze \`check_date=2025-MM-TT\` um zu hinterlegen, dass aus deiner Sicht alles aktuell ist.
* Wenn möglich, ergänze bitte auch das Verkehrszeichen ([Tagging-Hilfe](https://trafficsigns.osm-verkehrswende.org/)) bzw. \`traffic_sign=none\`.
* Wenn du ein aussagekräftiges Foto in Mapillary siehst, füge es als \`mapillary=IMAGE_KEY\` hinzu.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    // TODO: Add line about how to count width based on stones
    // TODO: Add wiki link about how to calculate the width
    case 'missing_width':
      return `
Diesem Weg fehlt eine Angabe zur Breite.

## Aufgabe

**Bitte ergänze die Breitenangabe.**

* Nutze \`width\`, wenn du die Breite ausmessen kannst. Das geht mit einem Metermaß oder einer Handy-App.
* Nutze \`est_width\`, wenn du nur einen Schätzwert eintragen kannst.

Tipp: Android Nutzer:innen empfehlen wir [StreetComplete](https://streetcomplete.app/). Dort ist ein Messgerät direkt eingebaut.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'missing_surface':
      return `
Diesem Weg fehlt eine Angabe zur Oberfläche.

## Aufgabe

**Bitte ergänze die Angabe zur Oberfläche** und gerne auch zur Oberflächenqualität.**

* Nutze \`surface\` um die Oberfläche zu beschreiben. [Zum Wiki](https://wiki.openstreetmap.org/wiki/DE:Key:surface)
* Nutze \`smoothness\` um die Oberflächenqualität zu beschreiben. Dieser Wert ist subjektiver, bitte orientiere dich an den [Beispielen im Wiki](https://wiki.openstreetmap.org/wiki/DE:Key:smoothness) und [in dieser Gallerie](https://wiki.openstreetmap.org/wiki/Key:smoothness/Gallery).

Tipp: Android Nutzer:innen empfehlen wir [StreetComplete](https://streetcomplete.app/). Dort findet du gute Beispielbilder, was die Erfassung vereinfacht.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'deprecated_cycleway_shared':
      return `
Dieser Weg hat den veralteten Tag \`cycleway=shared\`. Diese wollen wir aktualisieren.

## Aufgabe

**Bitte prüfe die Infrastruktur und aktualisiere das Tagging.**

* In vielen Fällen kann das \`cycleway=shared\` einfach gelöscht werden.
* Wenn keine Radinfrastruktur vorliegt, ergänze \`cycleway:both=no\`

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'needs_clarification_track':
      return `
Dieser Weg ist als \`cycleway=track\` eingetragen. Das sind nicht genug Daten, um eine eindeutige Radinfrastruktur-Kategorie zu vergeben.

## Aufgabe

**Bitte prüfe die Infrastruktur und aktualisiere das Tagging.**

_Wenn du so wenig wie möglich ändern möchtest:_

* Ergänze \`cycleway:right:segregated=yes\`, wenn Rad- und Fußverkehr getrennt sind — bzw. \`no\` bei einem gem. Geh-Radweg.
* Ergänze \`cycleway:right:traffic_sign=*\`, mit dem [passenden Verkehrszeichen](https://trafficsigns.osm-verkehrswende.org/DE) — oder \`none\` wenn unbeschildert.

(Das gleiche gilt auch für \`cycleway:right:*\` bzw. \`cycleway:both:*\`.)

_Wenn du dir zutraust die Geometrie umzuwandeln:_ In vielen Fällen bietet es sich an, den Weg als separate Geometrie parallel zur Straße einzutragen:

* [Das Wiki gibt gute Hilfestellung](https://wiki.openstreetmap.org/wiki/DE:Bicycle/Radverkehrsanlagen_kartieren#Stra%C3%9Fenbegleitende_Wege).
* [Das Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/DE) hilft, den Weg mit passenden Attributen auszustatten.
* Bitte ergänze \`is_sidepath=yes\` um den Weg als straßenbegleitend zu attributieren.
* Und ändere die Tags an der Straße, die auf den neuen Weg verweisen (siehe Wiki).
* Kreuzt der neue Weg andere Wege? Hier bitte den Übergang passend eintragen.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'mixed_cycleway_both':
      return `
Dieser Weg hat Tags die sich überschneiden:
* sowohl eine Angabe \`cycleway\` oder \`cycleway:both\` (Tags für beide Seiten)
* als auch eine Angabe für eine Seite (z.B. \`cycleway:right\`)

Diese Überschneidung erschwert die Datenverarbeitung und kann zu falschen Ergebnissen führen.

## Aufgabe

**Bitte kontrolliere die Angaben und ändere sie, so dass sie eindeutig sind.**

* Wenn auf beiden Straßenseiten Radinfrastruktur vorhanden ist, wählen \`cycleway:both\` und lösche die Angaben zur Seite.
* Wenn nur auf einer Straßenseite Radinfrastruktur vorhanden ist, _lösche_ die Angabe \`cycleway:both\` bzw. \`cycleway\`. Jede Seite sollte dann einen Wert oder ein \`no\` haben.

In wenigen fällen kommt ein Tagging wie \`cycleway=left\` vor. Das ist ein Tagging-Fehler und kann – nach Kontrolle – zu Gunsten [des üblichen Taggings](https://wiki.openstreetmap.org/wiki/DE:Bicycle/Radverkehrsanlagen_kartieren#Stra%C3%9Fenbegleitende_Wege) gelöscht werden.

## Hilfsmittel

* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
`
    case 'malformed_traffic_sign':
      return `
Das Verkehrszeichen-Tag an diese Weg enthält einen Fehler.

## Aufgabe

**Bitte prüfe und korrigiere den Wert der Tags \`traffic_sign\`, \`traffic_sign:forward\`, \`traffic_sign:backward\`.**

* [Das Verkehrszeichen-Tool](https://trafficsigns.osm-verkehrswende.org/DE) hilft, den richtigen Wert zu finden
* Häufig sind es Tippfehler bei \`DE:\` oder zusätzliche Leerzeichen zwischen den Trennzeichen \`,\` und \`;\`. Auch Großschreibung wird geprüft.
* Es werden auch "verschachtelte" Tags geprüft wie zum Beispiel \`cycleway:right:traffic_sign\`

## Hilfsmittel

* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})
* [Mapillary-Link vom Anfang der Straße](${mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Mapillary-Link vom Ende der Straße](${mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' })})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/radinfra?map=17/${centerLat}/${centerLng})
`
  }
}
