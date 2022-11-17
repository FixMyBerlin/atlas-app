import React from 'react'

type Props = {
  verificationStatus: undefined | string
}

export const VerificationStatus: React.FC<Props> = ({ verificationStatus }) => {
  return (
    <div className="space-x-3 px-4 py-3">
      <>
        {verificationStatus === undefined ? (
          <span className="mb-2 font-semibold text-gray-800">
            Daten noch nicht verifizert
          </span>
        ) : (
          <span className="mb-2 font-semibold text-gray-800">
            Daten verifiziert als:
          </span>
        )}
        {verificationStatus == 'approved' && (
          <span className="text-green-600"> Richtig</span>
        )}
        {verificationStatus == 'rejected' && (
          <span className="text-orange-600"> Überarbeitung notwendig</span>
        )}
      </>
    </div>
  )
}
