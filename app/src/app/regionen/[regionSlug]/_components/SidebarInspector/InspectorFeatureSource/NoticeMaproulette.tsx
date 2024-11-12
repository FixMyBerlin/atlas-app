import { Markdown } from '@/src/app/_components/text/Markdown'
import {
  categoryToMaprouletteProjectKey,
  taskDescriptionMarkdown,
  todoMarkdownToMaprouletteProjectKey,
} from '@/src/app/api/maproulette/[projectKey]/_utils/taskMarkdown'
import { LineString } from 'geojson'
import { MapGeoJSONFeature } from 'react-map-gl/maplibre'

type Props = {
  identifier: string | null | undefined
  osmTypeIdString: string | undefined
  category: string | undefined
  todos: string | undefined
  geometry: MapGeoJSONFeature['geometry'] | undefined
}

export const NoticeMaproulette = ({
  identifier,
  osmTypeIdString,
  category,
  todos,
  geometry,
}: Props) => {
  // Unique array of projectKeys
  const maprouletteProjectKeys = Array.from(
    new Set([
      ...categoryToMaprouletteProjectKey(identifier),
      ...todoMarkdownToMaprouletteProjectKey(todos),
    ]),
  )
    .filter(Boolean)
    // For now, we don't want to show all those "missing traffic sign" tasks in the Inspector
    .filter((key) => !key.startsWith('missing_traffic_sign'))

  if (
    !maprouletteProjectKeys.length ||
    !identifier ||
    !osmTypeIdString ||
    !category ||
    geometry?.type !== 'LineString'
  ) {
    return null
  }

  return (
    <details className="prose prose-sm border-t border-white bg-purple-100 p-1 px-4 py-1.5">
      <summary className="cursor-pointer hover:font-semibold">
        Aufgaben{maprouletteProjectKeys.length > 1 ? 'n' : ''} zur Datenverbesserung (
        {maprouletteProjectKeys.length})
      </summary>
      <div className="my-0 ml-3">
        {maprouletteProjectKeys.map((projectKey) => {
          return (
            <Markdown
              key={projectKey}
              markdown={taskDescriptionMarkdown({
                projectKey: projectKey,
                osmTypeIdString,
                category,
                geometry: geometry as LineString, // Guarded above
              })}
              className="prose-sm mb-10 border-b-4 border-b-white pb-10 marker:text-purple-700 first:mt-5 last:mb-0 last:border-b-0"
            />
          )
        })}
      </div>
    </details>
  )
}
