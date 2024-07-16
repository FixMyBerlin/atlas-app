import { LineString } from '@turf/helpers'
import { translations } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/TagsTable/translations/translations.const'
import { mapillaryUrl } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { pointFromGeometry } from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/pointFromGeometry'
import { maprouletteProjects } from './maprouletteProjects.const'

type MapRouletteProjectKey = (typeof maprouletteProjects)[number]
type Props = {
  projectKey: MapRouletteProjectKey
  osmTypeIdString: string
  category: string
  geometry: LineString
}

export const categoryToMaprouletteProjectKey = (category: string | undefined | null) => {
  if (category?.includes('adjoiningOrIsolated')) {
    return 'adjoiningOrIsolated' as MapRouletteProjectKey
  }
  if (category?.includes('advisoryOrExclusive')) {
    return 'advisoryOrExclusive' as MapRouletteProjectKey
  }
  if (category === 'needsClarification') {
    return 'needsClarification' as MapRouletteProjectKey
  }
  return undefined
}

export const taskDescriptionMarkdown = ({
  projectKey,
  osmTypeIdString,
  category,
  geometry,
}: Props) => {
  const [lng, lat] = pointFromGeometry(geometry)
  const categoryTranslated = translations[`ALL--category=${category}`]
    ?.replace('(Straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)', '')
    ?.replace('(Kategorisierung unklar)', '')
    ?.trim()

  // Do not add indentation, it will break the Markdown in Maproulette
  // Use in Maproulette as `{task_markdown}`
  return (() => {
    switch (projectKey) {
      case 'adjoiningOrIsolated':
        return `
## Kontext

Für diese Infrastruktur (${categoryTranslated}) fehlt uns eine Angabe ob sie straßenbegleitend ist (oder nicht).

## Aufgabe

Bitte präzisiere das Tagging.
* Ist die Infrastruktur ein Gehweg? Dann wähle "Gehweg" als Typ aus oder füge \`footway=sidepath\` hinzu.
* Ist die Infrastruktur ein Radweg oder geteilter/gemeinsamer Geh- und Radweg? Dann ergänze bitte \`is_sidepath=yes\` wenn der Weg straßenbegleitend ist oder \`is_sidepath=no\` für selbständig/frei geführt Wege.

## Hilfsmittel

* [Mapillary-Link zu dieser Stelle](${mapillaryUrl(geometry, 3)})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${lat}/${lng})
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

* [Mapillary-Link zu dieser Stelle](${mapillaryUrl(geometry, 3)})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${lat}/${lng})
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

* [Mapillary-Link zu dieser Stelle](${mapillaryUrl(geometry, 3)})
* [Radverkehrsatlas an dieser Stelle](https://radverkehrsatlas.de/regionen/deutschland?map=13/${lat}/${lng})
* [OpenStreetMap](https://www.openstreetmap.org/${osmTypeIdString})

`
    }
  })()
}
