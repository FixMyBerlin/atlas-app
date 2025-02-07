import { LinkExternal } from '@/src/app/_components/links/LinkExternal'
import { Markdown } from '@/src/app/_components/text/Markdown'
import { maprouletteTaskDescriptionMarkdown } from '@/src/app/api/maproulette/[projectKey]/_utils/taskMarkdown'
import { radinfraDeCampaigns } from '@/src/app/regionen/(index)/_data/radinfraDeCampaigns.generated.const'
import { TodoId } from '@/src/processingTypes/todoIds.const'
import { LineString } from 'geojson'
import { Fragment } from 'react'
import { pointFromGeometry } from '../Tools/osmUrls/pointFromGeometry'
import { NoticeMaproulette } from './NoticeMaproulette'

type Props = { projectKey: TodoId } & Omit<NoticeMaproulette, 'properties' | 'sourceId'>

export const NoticeMaprouletteTask = ({ projectKey, osmTypeIdString, kind, geometry }: Props) => {
  const maprouletteCampaign = radinfraDeCampaigns.find((c) => c.id === projectKey)
  const headline = maprouletteCampaign?.menuTitle
  const mapRouletteId = maprouletteCampaign?.maprouletteChallenge?.id

  if (!osmTypeIdString) return null
  if (geometry?.type !== 'LineString') return null

  const text = maprouletteTaskDescriptionMarkdown({
    projectKey,
    osmTypeIdString,
    kind: kind || 'UNKOWN', // Fallback is needed because TS cannot know that we only use this when the `kind` is known
    geometry: geometry as LineString, // Guarded above
  })

  if (!text) return null

  const [centerLng, centerLat] = pointFromGeometry(geometry)
  const rapidCampaignLink = `https://rapideditor.org/edit#map=19/${centerLat}/${centerLng}&maproulette=${mapRouletteId}&datasets=&disable_features=boundaries`
  const maprouletteLink = `https://maproulette.org/browse/challenges/${mapRouletteId}`

  return (
    <Fragment key={projectKey}>
      <h2>{headline || `${projectKey} (in Arbeit)`}</h2>
      {/* <div className="mb-5 mt-0 flex flex-col items-center gap-1.5 rounded-sm bg-white/80 p-3">
                <LinkExternal href={rapidCampaignLink} blank button>
                  In OpenStreetMap bearbeiten
                </LinkExternal>
                <LinkExternal href={maprouletteLink} blank>
                  MapRoulette Kampagne
                </LinkExternal>
              </div> */}
      <div className="mb-5 mt-0 flex flex-col items-center gap-1.5 rounded-sm bg-white/80 p-3">
        <LinkExternal href={maprouletteLink} blank button>
          Als MapRoulette Aufgabe bearbeiten
        </LinkExternal>
      </div>
      <Markdown
        markdown={text}
        className="prose-sm mb-10 border-b-4 border-b-white pb-10 marker:text-purple-700 first:mt-5 last:mb-0 last:border-b-0"
      />
    </Fragment>
  )
}
