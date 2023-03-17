import { Markdown } from '@components/text'
import { userById } from '@fakeServer/utils'
import { BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import React from 'react'

type verificationEvent = {
  id: number
  verified: string
  verified_by: string
  verified_at: string
  comment?: string
}

type Props = {
  history: verificationEvent[]
}

export const VerificationHistoryWidget: React.FC<Props> = ({ history }) => {
  return (
    <div className="flow-root">
      <ul>
        {history.map((event) => {
          const date = new Date(event.verified_at)
          const datetimeFormatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
          const verifiedBy =
            userById(parseInt(event.verified_by))?.displayName || '(Unbekannter Nutzer)'

          return (
            <li key={event.verified_at}>
              <div className="m-1 flex space-x-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full">
                  {event.verified === 'approved' ? (
                    <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <BoltIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <div className="flex min-w-0 flex-1 justify-between space-x-4">
                  <div className="text-sm text-gray-500">{verifiedBy}</div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time>{datetimeFormatted}</time>
                  </div>
                </div>
              </div>
              {event.comment && (
                <details open={true} className="ml-7 mr-1">
                  <summary className="cursor-default">Kommentar</summary>
                  <Markdown markdown={event.comment} className="prose-sm prose-p:text-gray-500" />
                </details>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
