import React from 'react'
import classNames from 'classnames'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'

interface verificationEvent {
  id: number
  verified: string
  verified_by: string
  verified_at: string
}

interface Props {
  history: verificationEvent[]
}

const VerificationHistoryWidget: React.FC<Props> = ({ history }) => {
  return (
    <div className="flow-root">
      <ul>
        {history.map((event) => {
          const date = new Date(event.verified_at)
          const datetimeFormatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
          const verifiedBy = event.verified_by || 'Some OSM User'
          const [Icon, iconBackground] =
            event.verified === 'approved'
              ? [CheckIcon, 'bg-green-500']
              : [XMarkIcon, 'bg-red-500']
          return (
            <li key={event.verified_at}>
              <div className="m-1 flex space-x-2">
                <span
                  className={classNames(
                    iconBackground,
                    'flex h-5 w-5 items-center justify-center rounded-full'
                  )}
                >
                  <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 justify-between space-x-4">
                  <div className="text-sm text-gray-500">{verifiedBy}</div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time>{datetimeFormatted}</time>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default VerificationHistoryWidget
