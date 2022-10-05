import { Link, useMatch } from '@tanstack/react-location'
import React from 'react'

type Props = {
  zustandValues?: any
}

export const StoreDebugBox: React.FC<Props> = ({ zustandValues }) => {
  const {
    params: { regionPath },
  } = useMatch()

  const keyValue = (object: any) => {
    return Object.entries(object).map(([key, value]) => {
      return (
        <div key={key}>
          <strong>{key}:</strong> {JSON.stringify(value)}
        </div>
      )
    })
  }

  return (
    <>
      <div className="absolute top-3 right-10 z-50 max-h-screen max-w-[60%] overflow-y-scroll rounded bg-pink-300 px-3 text-[10px]">
        {!!regionPath && (
          <Link
            to={`/regionen/${regionPath}`}
            className="m-1 rounded border p-1"
          >
            Retest {regionPath} default
          </Link>
        )}
        <details>
          <summary>Zustand</summary>
          <div className="font-mono">{keyValue(zustandValues)}</div>
        </details>
      </div>
    </>
  )
}
