import { Link, useMatch } from '@tanstack/react-location'
import React from 'react'
import { useMapInterfaceStore } from './useMapInterfaceStore'

export const DebugBoxZustandStore: React.FC = () => {
  const {
    params: { regionPath },
  } = useMatch()
  const zustandValues = useMapInterfaceStore()
  const { showDebugInfo, setShowDebugInfo } = useMapInterfaceStore()

  const keyValue = (object: any) => {
    return Object.entries(object).map(([key, value]) => {
      return (
        <div key={key}>
          <strong>{key}:</strong> {JSON.stringify(value)}
        </div>
      )
    })
  }

  if (!showDebugInfo) return null

  return (
    <>
      <div className="absolute top-3 right-12 z-50 max-h-screen max-w-[60%] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
        <button
          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border bg-purple-500/90 hover:bg-purple-800 hover:text-purple-200"
          onClick={() => setShowDebugInfo(false)}
        >
          &times;
        </button>
        {!!regionPath && (
          <Link to={`/regionen/${regionPath}`} className="rounded border p-1">
            Reset {regionPath} default
          </Link>
        )}
        <details>
          <summary className="cursor-pointer">Zustand</summary>
          <div className="font-mono">{keyValue(zustandValues)}</div>
        </details>
      </div>
    </>
  )
}
