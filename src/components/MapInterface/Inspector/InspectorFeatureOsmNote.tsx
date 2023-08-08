import { Link } from '@components/Link'
import React from 'react'
import { Disclosure } from './Disclosure'
import clsx from 'clsx'
import { proseClasses } from '@components/text'
import { InspectorOsmNoteFeature } from './Inspector'
import { CheckIcon } from '@heroicons/react/24/solid'
import dompurify from 'dompurify'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'

type Comment = {
  date: string
  uid: number
  user: string
  user_url: `https://api.openstreetmap.org/user/${string}`
  action: 'opened' | 'commented' | 'closed'
  text: string
  html: string
}[]

type Thread = {
  id: number
  url: `https://api.openstreetmap.org/api/0.6/notes/${number}`
  comment_url: `https://api.openstreetmap.org/api/0.6/notes/${number}/comment`
  close_url: `https://api.openstreetmap.org/api/0.6/notes/${number}/close`
  date_created: string
  status: 'open'
  comments: Comment
}

export const InspectorFeatureOsmNote: React.FC<InspectorOsmNoteFeature> = ({ properties }) => {
  // if (!sourceKey || !properties) return null

  // The documentedKeys info is placed on the source object
  // const sourceId = extractDataIdIdFromDataKey(sourceKey) as DatasetIds
  // const sourceData = sourcesDatasets.find((dataset) => dataset.id == sourceId)

  // if (typeof sourceData === 'undefined') return null
  // if (!sourceData.inspector.enabled) return null
  if (!properties) return null

  const thread = {
    ...properties,
    date_created: new Date(properties.date_created).toLocaleString('de-DE'),
    comments: JSON.parse(properties.comments as string) as Comment,
  } as Thread

  return (
    <div className="mt-5 w-full rounded-2xl">
      <Disclosure
        title="Öffentlicher Kommentar auf openstreetmap.org"
        objectId={String(thread.id)}
        statusIcon={
          properties?.status == 'closed' ? (
            <CheckIcon className="green h-5 w-5" aria-hidden="true" />
          ) : (
            <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" aria-hidden="true" />
          )
        }
      >
        {thread.comments?.map((comment, index) => {
          const firstComment = index === 0
          const date = new Date(comment.date).toLocaleString('de-DE')
          return (
            <section key={comment.uid} className="border-b border-b-gray-200 bg-teal-50 px-3 py-2">
              <p className="text-black">
                <strong>{comment.user || 'Eine anonyme Nutzer:in'}</strong> kommentiert am {date}:
              </p>

              <div
                dangerouslySetInnerHTML={{ __html: dompurify.sanitize(comment.html) }}
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
            Status: <span className="uppercase">{thread.status}</span>
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
