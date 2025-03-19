import { translations } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/TagsTable/translations/translations.const'
import { mapillaryUrl } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { pointFromGeometry } from '@/src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/pointFromGeometry'
import { TodoId } from '@/src/data/processingTypes/todoIds.const'
import { campaigns } from '@/src/data/radinfra-de/campaigns'
import { point } from '@turf/turf'
import { LineString } from 'geojson'

type Props = {
  projectKey: TodoId
  osmTypeIdString: string
  /** `bikelane.category` or `roads.road` */
  kind: string
  geometry: LineString
}

export const buildTaskInstructions = ({ projectKey, osmTypeIdString, kind, geometry }: Props) => {
  const [centerLng, centerLat] = pointFromGeometry(geometry)
  const startPoint = point(geometry.coordinates[0]!).geometry
  const endPoint = point(geometry.coordinates.at(-1)!).geometry

  const infrastructureName = translations[`ALL--category=${kind}`]
    ?.replace('(Straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)', '')
    ?.replace('(Kategorisierung unklar)', '')
    ?.trim()

  const replacements = new Map([
    [
      '%%CATEGORY%%', //
      infrastructureName,
    ],
    [
      '%%MAPILLARY_URL_START%%',
      mapillaryUrl(startPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' }),
    ],
    [
      '%%MAPILLARY_URL_END%%',
      mapillaryUrl(endPoint, { yearsAgo: 2, zoom: 17, trafficSign: 'all' }),
    ],
    ['%%ATLAS_URL%%', `https://tilda-geo.de/regionen/radinfra?map=17/${centerLat}/${centerLng}`],
    [
      '%%OSM_URL%%', //
      `https://www.openstreetmap.org/${osmTypeIdString}`,
    ],
  ])

  // REMINDER: This is not the full text. This just what is added to MR with `{task_markdown}`
  //           Some other parts are added by the default instructions when we create/update the challenge.
  //           This is done because we need to use Mustache tags for some features which cannot be part of this string.
  const campaign = campaigns.find((c) => c.id === (projectKey as string))

  let text = campaign?.taskTemplate || ''
  replacements.forEach((value, key) => {
    if (!value) return
    text = text.replaceAll(key, value)
  })

  return text
}
