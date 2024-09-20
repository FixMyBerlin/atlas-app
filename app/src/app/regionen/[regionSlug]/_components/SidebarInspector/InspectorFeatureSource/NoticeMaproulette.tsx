import { LineString } from '@turf/turf'
import { MapGeoJSONFeature } from 'react-map-gl/maplibre'
import { Markdown } from 'src/app/_components/text/Markdown'
import {
  categoryToMaprouletteProjectKey,
  taskDescriptionMarkdown,
} from 'src/app/api/maproulette/[projectKey]/_utils/taskMarkdown'

type Props = {
  identifier: string | null | undefined
  osmTypeIdString: string | undefined
  category: string | undefined
  geometry: MapGeoJSONFeature['geometry'] | undefined
}

export const NoticeMaproulette = ({ identifier, osmTypeIdString, category, geometry }: Props) => {
  const maprouletteProjectKeys = categoryToMaprouletteProjectKey(identifier)
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
        Kampagne zur Datenverbesserung
      </summary>
      <div className="my-0 ml-3 space-y-3">
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
              className="prose-sm marker:text-purple-700"
            />
          )
        })}
      </div>
    </details>
  )
}
