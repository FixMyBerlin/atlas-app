import { LinkExternal } from '@/src/app/_components/links/LinkExternal'
import { SmallSpinner } from '@/src/app/_components/Spinner/SmallSpinner'
import { Markdown } from '@/src/app/_components/text/Markdown'
import { maprouletteTaskDescriptionMarkdown } from '@/src/app/api/maproulette/[projectKey]/_utils/taskMarkdown'
import { radinfraDeCampaigns } from '@/src/app/regionen/(index)/_data/radinfraDeCampaigns.generated.const'
import { TodoId } from '@/src/processingTypes/todoIds.const'
import { useQuery } from '@tanstack/react-query'
import { LineString } from 'geojson'
import { Fragment } from 'react'
import { z } from 'zod'
import { osmEditIdUrl } from '../Tools/osmUrls/osmUrls'
import { NoticeMaproulette } from './NoticeMaproulette'

const maprouletteTaskSchema = z.object({
  id: z.number(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
})

const fetchMapRouletteTask = async (
  mapRouletteId: number | null | undefined,
  osmTypeIdString: string | undefined,
) => {
  const url = `https://maproulette.org/api/v2/challenge/${mapRouletteId || 'MISSING'}/task/${encodeURIComponent(osmTypeIdString || 'MISSING')}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const json = await response.json()
  return maprouletteTaskSchema.parse(json)
}

type Props = { projectKey: TodoId } & Omit<NoticeMaproulette, 'sourceId'>

export const NoticeMaprouletteTask = ({
  projectKey,
  osmTypeIdString,
  kind,
  properties,
  geometry,
}: Props) => {
  const maprouletteCampaign = radinfraDeCampaigns.find((c) => c.id === projectKey)
  const headline = maprouletteCampaign?.menuTitle
  const mapRouletteId = maprouletteCampaign?.maprouletteChallenge?.id

  const { data, isLoading } = useQuery({
    queryKey: ['mapRouletteTask', mapRouletteId, properties.id],
    queryFn: () => fetchMapRouletteTask(mapRouletteId, properties.id),
    enabled: !!mapRouletteId,
  })

  if (!osmTypeIdString) return null
  if (geometry?.type !== 'LineString') return null

  const text = maprouletteTaskDescriptionMarkdown({
    projectKey,
    osmTypeIdString,
    kind: kind || 'UNKOWN', // Fallback is needed because TS cannot know that we only use this when the `kind` is known
    geometry: geometry as LineString, // Guarded above
  })

  if (!text) return null

  // The location of the MR pin is the best we can use, but we can always fall back to the one we use internally elsewhere
  // const [centerLng, centerLat] = data?.location?.coordinates || pointFromGeometry(geometry)
  // const rapidCampaignLink = `https://rapideditor.org/edit#map=19/${centerLat}/${centerLng}&maproulette=${mapRouletteId}&datasets=&disable_features=boundaries`

  const maprouletteTaskLink = isLoading
    ? undefined
    : data?.id
      ? `https://maproulette.org/challenge/${mapRouletteId}/task/${data.id}`
      : undefined

  const maprouletteCampaignLink = `https://maproulette.org/browse/challenges/${mapRouletteId}`

  const [osmType, osmId] = osmTypeIdString.split('/')
  // @ts-expect-error we could clean this up…
  const osmEditIdUrlHref = osmEditIdUrl({ osmType, osmId })

  return (
    <Fragment key={projectKey}>
      <h2>{headline || `${projectKey} (in Arbeit)`}</h2>
      <p className="-mt-5 text-right text-xs">
        {mapRouletteId ? (
          <LinkExternal
            href={maprouletteCampaignLink}
            title="MapRoulette"
            className="text-xs"
            blank
          >
            MR #{mapRouletteId}
          </LinkExternal>
        ) : (
          <>No MR ID</>
        )}
      </p>
      <div className="mb-5 mt-0 flex flex-col items-center gap-1.5 rounded-sm bg-white/80 p-3">
        {/* See https://github.com/facebook/Rapid/issues/1686 */}
        {/* <LinkExternal href={rapidCampaignLink} blank button>
          In OpenStreetMap bearbeiten
        </LinkExternal> */}
        {isLoading ? (
          <SmallSpinner />
        ) : maprouletteTaskLink ? (
          <LinkExternal href={maprouletteTaskLink} blank button>
            Als MapRoulette Aufgabe bearbeiten
          </LinkExternal>
        ) : (
          <span className="text-gray-500">Fehler: Konnte MapRoulette URL nicht generieren</span>
        )}
        {osmEditIdUrlHref && (
          <LinkExternal
            href={osmEditIdUrlHref}
            blank
            button={isLoading === false && !maprouletteTaskLink}
          >
            Bearbeiten im iD Editor
          </LinkExternal>
        )}
      </div>
      <Markdown
        markdown={text}
        className="prose-sm mb-10 border-b-4 border-b-white pb-10 marker:text-purple-700 first:mt-5 last:mb-0 last:border-b-0"
      />
    </Fragment>
  )
}
