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

const maprouletteStatus = new Map([
  [0, 'Offen'],
  [1, 'Erledigt'],
  [2, 'Erledigt (war kein Problem)'],
  [3, 'Offen (übersprungen)'],
  [4, 'Gelöscht'],
  [5, 'Erledigt (war bereits erledigt)'],
  [6, 'Offen (zu schwer?)'],
])
const maprouletteStatusCompleted = [1, 2, 4, 5]

const maprouletteTaskSchema = z.object({
  id: z.number(),
  // https://maproulette-python-client.readthedocs.io/en/latest/usage/functionality.html
  //  0 = Created, 1 = Fixed, 2 = False Positive, 3 = Skipped, 4 = Deleted, 5 = Already Fixed, 6 = Too Hard
  status: z.number(),
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
  const radinfraCampaign = radinfraDeCampaigns.find((c) => c.id === projectKey)
  const maprouletteCampaign =
    radinfraCampaign?.maprouletteChallenge.discriminant === true ? radinfraCampaign : undefined
  const mapRouletteId =
    maprouletteCampaign?.maprouletteChallenge?.discriminant === true
      ? maprouletteCampaign?.maprouletteChallenge?.value?.id
      : undefined

  const showMaproulette =
    radinfraCampaign?.recommendedAction === 'maproulette' &&
    radinfraCampaign?.maprouletteChallenge.discriminant === true
  const showStreetcomplete = radinfraCampaign?.recommendedAction === 'streetcomplete'
  const showEditor = radinfraCampaign?.recommendedAction === 'map'

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

  if (!text) {
    return <p>(Die Aufgabenbeschreibung ist noch in Arbeit)</p>
  }

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
  const completed = data?.status && maprouletteStatusCompleted.includes(data.status)

  return (
    <Fragment key={projectKey}>
      <h2>{radinfraCampaign?.menuTitle || `${projectKey} (in Arbeit)`}</h2>
      {mapRouletteId && (
        <p className="-mt-5 text-right text-xs">
          <LinkExternal
            href={maprouletteCampaignLink}
            title="MapRoulette"
            className="text-xs"
            blank
          >
            MR #{mapRouletteId}
          </LinkExternal>
        </p>
      )}
      <div className="mb-5 mt-0 flex flex-col items-center gap-1.5 rounded-sm bg-white/80 p-3">
        {/* See https://github.com/facebook/Rapid/issues/1686 */}
        {/* <LinkExternal href={rapidCampaignLink} blank button>
          In OpenStreetMap bearbeiten
        </LinkExternal> */}
        {showMaproulette && (
          <>
            {isLoading ? (
              <span className="flex items-center gap-2 text-gray-400">
                <SmallSpinner /> Lade MapRoulette-Link…
              </span>
            ) : maprouletteTaskLink ? (
              <>
                {completed && <strong>🎉 Die Aufgabe wurde bereits erledigt.</strong>}
                <LinkExternal href={maprouletteTaskLink} blank button={!completed}>
                  {completed ? 'MapRoulette öffnen' : 'Als MapRoulette Aufgabe bearbeiten'}
                </LinkExternal>
              </>
            ) : (
              <span className="text-gray-500">Fehler: Konnte MapRoulette URL nicht generieren</span>
            )}
          </>
        )}
        {showStreetcomplete && (
          <LinkExternal href="https://radinfra.de/mitmachen/streetcomplete/" blank button>
            Tipp: Nutze StreetComplete für diese Daten
          </LinkExternal>
        )}
        {osmEditIdUrlHref && (
          <LinkExternal
            href={osmEditIdUrlHref}
            blank
            button={
              showMaproulette || showStreetcomplete
                ? false
                : isLoading === false && !maprouletteTaskLink
            }
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
