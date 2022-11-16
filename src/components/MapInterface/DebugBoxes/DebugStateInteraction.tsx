import {
  getApiUrl,
  getTilesUrl,
  isDev,
  isProd,
  isStaging,
} from '@components/utils'
import React from 'react'
import { useMapStateInteraction } from '../mapStateInteraction'

export const DebugStateInteraction: React.FC = () => {
  const zustandValues = useMapStateInteraction()
  const { showDebugInfo, setShowDebugInfo } = useMapStateInteraction()

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
      <div className="absolute top-3 right-12 z-10 max-h-screen max-w-[60%] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
        <button
          className="absolute top-0 right-0 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-purple-500/90 hover:bg-purple-800 hover:text-purple-200"
          onClick={() => setShowDebugInfo(false)}
        >
          &times;
        </button>
        <details>
          <summary className="cursor-pointer">Zustand</summary>
          <div className="font-mono">{keyValue(zustandValues)}</div>
        </details>
        <details>
          <summary className="cursor-pointer">Urls</summary>
          <div className="font-mono">getApiUrl: {getApiUrl()}</div>
          <div className="font-mono">getTilesUrl: {getTilesUrl()}</div>
          <div className="font-mono">isDev: {JSON.stringify(isDev)}</div>
          <div className="font-mono">
            isStaging: {JSON.stringify(isStaging)}
          </div>
          <div className="font-mono">
            isProduction: {JSON.stringify(isProd)}
          </div>
        </details>
      </div>
    </>
  )
}
