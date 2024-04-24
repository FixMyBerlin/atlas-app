import { LineString } from '@turf/turf'
import { MapGeoJSONFeature } from 'react-map-gl/maplibre'
import { Markdown } from 'src/app/_components/text/Markdown'
import {
  categoryToMaprouletteProjectKey,
  taskDescriptionMarkdown,
} from 'src/app/api/maproulette/[projectKey]/_utils/taskMarkdown'

type Props = {
  identifier: string | null | undefined
  osmId: string | undefined
  osmType: 'W' | undefined
  category: string | undefined
  geometry: MapGeoJSONFeature['geometry'] | undefined
}

export const NoticeMaproulette = ({ identifier, osmId, osmType, category, geometry }: Props) => {
  const maprouletteProjectKey = categoryToMaprouletteProjectKey(identifier)
  if (
    !maprouletteProjectKey ||
    !identifier ||
    !osmId ||
    !osmType ||
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
      <div className="my-0 ml-3 py-3">
        <Markdown
          markdown={taskDescriptionMarkdown({
            projectKey: maprouletteProjectKey,
            id: osmId,
            type: osmType,
            category,
            geometry: geometry as LineString, // Guarded above
          })}
          className="prose-sm marker:text-purple-700"
        />
      </div>
    </details>
  )
}
