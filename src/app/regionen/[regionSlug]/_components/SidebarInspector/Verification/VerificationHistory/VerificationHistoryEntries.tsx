import { BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { Markdown } from 'src/app/_components/text/Markdown'
import { TVerification } from 'src/bikelane-verifications/queries/getBikelaneVerification'
import { userById } from 'src/users/components/utils/usersUtils'

type Props = {
  history: TVerification[]
}

export const VerificationHistoryEntries = ({ history }: Props) => {
  return (
    <div className="mt-2 flow-root">
      <ul>
        {history.map((event) => {
          const date = new Date(event.verified_at)
          const datetimeFormatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
          const verifiedBy =
            userById(Number(event.verified_by))?.displayName || '(Unbekannter Nutzer)'

          return (
            <li key={event.id} className="flex gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full">
                {event.verified === 'approved' ? (
                  <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <BoltIcon className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
              <div className="mb-3 w-full">
                <div className="flex min-w-0 flex-1 justify-between space-x-4">
                  <div className="text-sm text-gray-500">{verifiedBy}</div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time>{datetimeFormatted}</time>
                  </div>
                </div>
                {event.comment && (
                  <Markdown
                    markdown={event.comment}
                    className="prose-sm mr-1 mt-2 border-l border-gray-400 pl-2 prose-p:leading-tight prose-p:text-gray-500 prose-ol:pl-3 prose-ol:leading-tight prose-ul:pl-3 prose-ul:leading-tight prose-li:m-0 prose-li:p-0 prose-li:marker:text-gray-500"
                  />
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
