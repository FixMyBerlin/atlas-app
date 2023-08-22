import { Link } from '@components/Link'
import Tooltip from '@components/Tooltip/Tooltip'
import { proseClasses } from '@components/text'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { LocationGenerics } from '@routes/routes'
import { useMatch } from '@tanstack/react-location'
import clsx from 'clsx'
import React from 'react'
import { hasPermissionByDisplayName } from '../UserInfo'
import { Disclosure } from './Disclosure'
import { InspectorOsmNoteFeature } from './Inspector'

type Comment = {
  date: string
  uid: number
  user: string | undefined
  user_url: `https://api.openstreetmap.org/user/${string}`
  action: 'opened' | 'commented' | 'closed'
  text: string
  html: string
}

type Thread = {
  id: number
  url: `https://api.openstreetmap.org/api/0.6/notes/${number}`
  comment_url: `https://api.openstreetmap.org/api/0.6/notes/${number}/comment`
  close_url: `https://api.openstreetmap.org/api/0.6/notes/${number}/close`
  date_created: string
  status: 'open' | 'closed'
  comments: Comment[]
}

const OsmUserLink = ({
  user,
  hasPermission,
}: Pick<Comment, 'user'> & { hasPermission: boolean }) => {
  if (!user) return <>Eine anonyme Nutzer:in</>

  return (
    <Link
      external
      blank
      to={`https://www.openstreetmap.org/user/${user}`}
      className="relative inline-flex gap-1"
    >
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

export const InspectorFeatureOsmNote: React.FC<InspectorOsmNoteFeature> = ({ properties }) => {
  const {
    data: { region },
  } = useMatch<LocationGenerics>()

  if (!properties) return null

  const thread = {
    ...properties,
    date_created: new Date(properties.date_created).toLocaleString('de-DE'),
    comments: JSON.parse(properties.comments as string) as Comment[],
  } as Thread

  return (
    <div className="mt-5 w-full rounded-2xl">
      <Disclosure title="Öffentlicher Kommentar auf openstreetmap.org" objectId={String(thread.id)}>
        {thread.comments?.map((comment, index) => {
          const firstComment = index === 0
          const splitDate = comment.date.split(' ')
          const date = new Date(`${splitDate[0]}T${splitDate[1]}Z`).toLocaleString('de-DE')
          const userHasPermssionOnRegion = hasPermissionByDisplayName(comment.user, region)

          return (
            <section
              key={comment.uid}
              className={clsx(
                'border-b border-b-gray-200 px-3 py-5',
                userHasPermssionOnRegion ? 'bg-teal-100/70' : 'bg-teal-50'
              )}
            >
              <p className="text-black">
                <strong>
                  <OsmUserLink user={comment.user} hasPermission={userHasPermssionOnRegion} />
                </strong>{' '}
                kommentierte am {date}:
              </p>

              <div
                dangerouslySetInnerHTML={{ __html: comment.html }}
                className={clsx(
                  proseClasses,
                  'prose-sm my-2 border-l-4 border-white pl-3 prose-a:underline hover:prose-a:text-teal-700 hover:prose-a:decoration-teal-700'
                )}
              />
              {!firstComment && comment.action === 'opened' && (
                <p>
                  <em>Der Kommentar wurde erneut geöffnet.</em>
                </p>
              )}
              {comment.action === 'closed' && (
                <p>
                  <em>Der Kommentar wurde geschlossen.</em>
                </p>
              )}
            </section>
          )
        })}
        <div className="space-y-2 px-3 py-2">
          <p>
            Erstellt am {thread.date_created}
            <br />
            Status: {thread.status === 'closed' && 'geschlossen'}
            {thread.status === 'open' && 'offen'}
          </p>
          <p>
            <Link button external blank to={`https://www.openstreetmap.org/note/${thread.id}`}>
              Auf openstreetmap.org ansehen und kommentieren
            </Link>
          </p>
        </div>
      </Disclosure>
    </div>
  )
}
