import { todoMarkdownToMaprouletteCampaignKey } from '@/src/app/api/maproulette/[projectKey]/_utils/taskMarkdown'
import { todoIds, todoIdsTableOnly } from '@/src/processingTypes/todoIds.const'
import { GeoJsonProperties } from 'geojson'
import { MapGeoJSONFeature } from 'react-map-gl/maplibre'
import { NoticeMaprouletteTask } from './NoticeMaprouletteTask'

export type NoticeMaproulette = {
  sourceId: string
  osmTypeIdString: string | undefined
  kind: string | undefined
  properties: NonNullable<GeoJsonProperties>
  geometry: MapGeoJSONFeature['geometry'] | undefined
}

export const NoticeMaproulette = ({
  sourceId,
  osmTypeIdString,
  kind,
  properties,
  geometry,
}: NoticeMaproulette) => {
  // This is how we store todos on `bikelanes`, `roads`
  const todosKeyFromTodoTag = todoMarkdownToMaprouletteCampaignKey(properties?.todos)
  // This is how we store todos on `todos_lines`
  const todoKeysFromKeys = todoIds.filter((id) => Object.keys(properties).includes(id))
  const todoKeys = Array.from(new Set([...todosKeyFromTodoTag, ...todoKeysFromKeys]))

  // When we are on `bikelanes`, `roads`, we only show some todos; on
  const maprouletteProjectKeys =
    sourceId === 'atlas_todos_lines'
      ? todoKeys
      : todoKeys.filter((key) => todoIdsTableOnly.includes(key))

  if (!maprouletteProjectKeys.length || !osmTypeIdString || geometry?.type !== 'LineString') {
    return null
  }

  const defaultOpen = sourceId.includes('todos_lines')

  return (
    <details
      className="prose prose-sm border-t border-white bg-purple-100 p-1 px-4 py-1.5"
      open={defaultOpen}
    >
      <summary className="cursor-pointer hover:font-semibold">
        {/* NOTE: `maprouletteProjectKeys` is not ideal here because we might show viewer text block which is decided in the child component */}
        Aufgaben{maprouletteProjectKeys.length > 1 ? 'n' : ''} zur Datenverbesserung (
        {maprouletteProjectKeys.length})
      </summary>

      <div className="my-0 ml-3">
        {maprouletteProjectKeys.map((projectKey) => {
          return (
            <NoticeMaprouletteTask
              key={projectKey}
              projectKey={projectKey}
              osmTypeIdString={osmTypeIdString}
              kind={kind}
              geometry={geometry}
            />
          )
        })}
      </div>
    </details>
  )
}
