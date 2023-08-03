import React from 'react'
import { Disclosure } from './Disclosure'
import { InspectorOsmNoteFeature } from './Inspector'
import { Link } from '@components/Link'
import { CheckIcon } from '@heroicons/react/24/solid'
import {
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline'

export const InspectorFeatureOsmNote: React.FC<InspectorOsmNoteFeature> = ({ properties }) => {
  // if (!sourceKey || !properties) return null

  // The documentedKeys info is placed on the source object
  // const sourceId = extractDataIdIdFromDataKey(sourceKey) as DatasetIds
  // const sourceData = sourcesDatasets.find((dataset) => dataset.id == sourceId)

  // if (typeof sourceData === 'undefined') return null
  // if (!sourceData.inspector.enabled) return null

  return (
    <div className="mt-5 w-full rounded-2xl bg-white">
      <Disclosure
        title="OSM Notiz"
        objectId={properties?.id}
        statusIcon={
          properties?.status == 'closed' ? (
            <CheckIcon className="green h-5 w-5" aria-hidden="true" />
          ) : (
            <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" aria-hidden="true" />
          )
        }
      >
        {properties?.date_created && <div>{properties?.date_created}</div>}
        {properties?.closed_at && <div>{properties?.closed_at}</div>}

        <div className="black mt-2 flex">
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
          <h3>Konversation</h3>
        </div>
        {properties?.comments && (
          <div>
            {JSON.parse(properties?.comments).map((comment: any, index: number) => (
              <div key={index} className="border-t-2">
                Nutzer <Link to={comment.user_url}>{comment.user}</Link> hat am{' '}
                <span>{comment.date}</span>{' '}
                <span>{comment.action == 'opened' ? 'eröffnet' : 'geschlossen'}</span> und
                geschrieben: <div>{comment.html}</div>
              </div>
            ))}
          </div>
        )}
        {properties?.id && (
          <Link blank external button to={`https://www.openstreetmap.org/note/${properties.id}`}>
            Auf OSM.org ansehen
          </Link>
        )}
      </Disclosure>
    </div>
  )
}
