import { BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'
import { Markdown } from 'src/app/_components/text/Markdown'
import { TVerification } from 'src/bikelane-verifications/queries/getBikelaneVerification'
import { userById } from 'src/users/components/utils/usersUtils'
import { verifiedColor } from '../verifiedColor.const'

type Props = {
  verifications: TVerification[]
  visible: boolean
}

export const VerificationStatus: React.FC<Props> = ({ verifications, visible }) => {
  if (!visible) return null

  const latestEntry = verifications?.at(0)
  if (!latestEntry) return null

  const date = new Date(latestEntry.verified_at)
  const datetimeFormatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  const verifiedBy =
    userById(Number(latestEntry.verified_by))?.displayName || '(Unbekannter Nutzer)'

  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div
          className="rounded-full p-2 text-white"
          style={{
            backgroundColor: verifiedColor[latestEntry.verified],
          }}
        >
          {latestEntry.verified === 'approved' ? (
            <ShieldCheckIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <BoltIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <strong className="font-semibold text-gray-600">
          {latestEntry.verified === 'approved' ? 'Daten richtig' : 'Daten überarbeiten'}
        </strong>
        <div className="flex w-full flex-1 justify-between space-x-4">
          <div className="text-sm text-gray-500">{verifiedBy}</div>
          <div className="whitespace-nowrap text-right text-sm text-gray-500">
            <time>{datetimeFormatted}</time>
          </div>
        </div>
        {latestEntry.comment && (
          <Markdown
            markdown={latestEntry.comment}
            className="prose-sm mr-1 mt-2 border-l border-gray-400 pl-2 prose-p:leading-tight prose-p:text-gray-500 prose-ol:pl-3 prose-ol:leading-tight prose-ul:pl-3 prose-ul:leading-tight prose-li:m-0 prose-li:p-0 prose-li:marker:text-gray-500"
          />
        )}
      </div>
    </div>
  )
}
