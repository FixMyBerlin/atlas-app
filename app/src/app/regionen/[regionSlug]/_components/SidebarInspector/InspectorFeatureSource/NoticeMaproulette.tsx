import { Markdown } from '@/src/app/_components/text/Markdown'
import {
  maprouletteTaskDescriptionMarkdown,
  todoMarkdownToMaprouletteCampaignKey,
} from '@/src/app/api/maproulette/[projectKey]/_utils/taskMarkdown'
import { radinfraDeCampaigns } from '@/src/app/regionen/(index)/_data/radinfraDeCampaigns.generated.const'
import { LineString } from 'geojson'
import { Fragment } from 'react'
import { MapGeoJSONFeature } from 'react-map-gl/maplibre'

type Props = {
  sourceId: string
  osmTypeIdString: string | undefined
  bikelaneCategory: string | undefined
  todos: string | undefined
  geometry: MapGeoJSONFeature['geometry'] | undefined
}

export const NoticeMaproulette = ({
  sourceId,
  osmTypeIdString,
  bikelaneCategory,
  todos,
  geometry,
}: Props) => {
  const defaultOpen = sourceId.includes('todos_lines')
  const showTrafficSigns = sourceId.includes('todos_lines')

  const maprouletteProjectKeys = todoMarkdownToMaprouletteCampaignKey(todos)
    .filter(Boolean)
    .filter((key) =>
      // We hide the (verbose) traffic sign todos in our regular inspector.
      showTrafficSigns === true ? true : !key.startsWith('missing_traffic_sign'),
    )

  if (!maprouletteProjectKeys.length || !osmTypeIdString || geometry?.type !== 'LineString') {
    return null
  }

  const texts = maprouletteProjectKeys.map((projectKey) => {
    return [
      projectKey,
      maprouletteTaskDescriptionMarkdown({
        projectKey,
        osmTypeIdString,
        bikelaneCategory,
        geometry: geometry as LineString, // Guarded above
      }),
    ] as const
  })

  if (texts.length === 0) {
    return null
  }

  return (
    <details
      className="prose prose-sm border-t border-white bg-purple-100 p-1 px-4 py-1.5"
      open={defaultOpen}
    >
      <summary className="cursor-pointer hover:font-semibold">
        Aufgaben{texts.length > 1 ? 'n' : ''} zur Datenverbesserung ({texts.length})
      </summary>
      <div className="my-0 ml-3">
        {texts.map(([projectKey, text]) => {
          const headline = radinfraDeCampaigns.find((c) => c.id === projectKey)?.menuTitle

          return (
            <Fragment key={projectKey}>
              <h2>{headline || `(Überschrift für ${projectKey} unbekannt)`}</h2>
              <Markdown
                markdown={text}
                className="prose-sm mb-10 border-b-4 border-b-white pb-10 marker:text-purple-700 first:mt-5 last:mb-0 last:border-b-0"
              />
            </Fragment>
          )
        })}
      </div>
    </details>
  )
}
