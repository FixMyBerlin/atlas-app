import { useSession } from '@blitzjs/auth'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import dompurify from 'dompurify'
import Image from 'next/image'
import { Suspense } from 'react'
import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { Tooltip } from 'src/app/_components/Tooltip/Tooltip'
import { Link } from 'src/app/_components/links/Link'
import { proseClasses } from 'src/app/_components/text/prose'
import { twJoin } from 'tailwind-merge'
import { OsmNotesComment, OsmNotesThread } from '../OsmNotes/types'
import { Disclosure } from './Disclosure/Disclosure'
import { InspectorOsmNoteFeature } from './Inspector'
import SvgNotesClosed from './icons/notes_closed.svg'
import SvgNotesOpen from './icons/notes_open.svg'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { getOsmUrl } from 'src/app/_components/utils/getOsmUrl'

const OsmUserLink = ({
  user,
  hasPermission,
}: Pick<OsmNotesComment, 'user'> & { hasPermission: boolean }) => {
  if (!user) return <>Eine anonyme Nutzer:in</>

  return (
    <Link blank href={getOsmUrl(`/user/${user}`)} className="relative inline-flex gap-1">
      {user}{' '}
      {hasPermission ? (
        <Tooltip text="Ist Mitarbeiter:in dieser Region">
          <CheckBadgeIcon className="h-5 w-5" />
        </Tooltip>
      ) : (
        ''
      )}
    </Link>
  )
}

type Props = Pick<InspectorOsmNoteFeature, 'properties'>

const InspectorFeatureOsmNoteWithQuery = ({ properties }: Props) => {
  const { osmName } = useSession()
  const { osmNotesFeatures } = useMapStateInteraction()

  // We look up our data from our internal store.
  // This is better than to use the properties from Maplibre directly
  // because those are escaped, so properties.comments is stringified.
  const thread = osmNotesFeatures.features.find(
    (feature) => feature.properties.id === properties?.id,
  )?.properties

  if (!thread) return null

  return (
    <div className="mt-5 w-full rounded-2xl">
      <Disclosure title="Öffentlicher Hinweis auf openstreetmap.org" objectId={String(thread.id)}>
        {thread.comments?.map((comment, index) => {
          const firstComment = index === 0
          const splitDate = comment.date.split(' ')
          const date = new Date(`${splitDate[0]}T${splitDate[1]}Z`).toLocaleString('de-DE')
          const userHasPermssionOnRegion = comment.user === osmName

          return (
            <section
              key={`${thread.id}-${comment.date}`}
              className={twJoin(
                'border-b border-b-gray-200 px-3 py-5',
                userHasPermssionOnRegion ? 'bg-teal-100/70' : 'bg-teal-50',
              )}
            >
              <div className="text-black">
                <strong>
                  <OsmUserLink user={comment.user} hasPermission={userHasPermssionOnRegion} />
                </strong>{' '}
                kommentierte am {date}:
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: dompurify.sanitize(comment.html) }}
                className={twJoin(
                  proseClasses,
                  'prose-sm my-2 border-l-4 border-white pl-3 prose-a:underline hover:prose-a:text-teal-700 hover:prose-a:decoration-teal-700',
                )}
              />
              {!firstComment && comment.action === 'opened' && (
                <p>
                  <em>Der Hinweis wurde erneut geöffnet.</em>
                </p>
              )}
              {comment.action === 'closed' && (
                <p>
                  <em>Der Hinweis wurde geschlossen.</em>
                </p>
              )}
            </section>
          )
        })}
        <div className="space-y-3 px-3 py-3">
          <p>Erstellt am {thread.date_created}</p>
          <p className="flex items-center gap-2">
            Status:{' '}
            {thread.status === 'closed' && (
              <span className="inline-flex gap-1">
                <Image src={SvgNotesClosed} className="h-5 w-5" alt="" />
                geschlossen
              </span>
            )}
            {thread.status === 'open' && (
              <span className="inline-flex gap-1">
                <Image src={SvgNotesOpen} className="h-5 w-5" alt="" />
                offen
              </span>
            )}
          </p>
          <p>
            <Link button blank href={getOsmUrl(`/note/${thread.id}`)}>
              Auf openstreetmap.org ansehen und kommentieren
            </Link>
          </p>
        </div>
      </Disclosure>
    </div>
  )
}

export const InspectorFeatureOsmNote = ({ properties }: Props) => {
  return (
    <Suspense fallback={<Spinner />}>
      <InspectorFeatureOsmNoteWithQuery properties={properties} />
    </Suspense>
  )
}
