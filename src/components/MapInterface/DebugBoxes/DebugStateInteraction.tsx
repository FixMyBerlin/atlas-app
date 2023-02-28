import { getApiUrl, isDev, isProd, isStaging } from '@components/utils'
import { Link, useMatch } from '@tanstack/react-location'
import { useMapStateInteraction } from '../mapStateInteraction'
import { useMapDebugState } from '../mapStateInteraction/useMapDebugState'

export const DebugStateInteraction = () => {
  const zustandValues = useMapStateInteraction()
  const { showDebugInfo, setShowDebugInfo } = useMapDebugState()
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

  if (!showDebugInfo) return null

  return (
    <>
      <div className="group absolute top-3 right-12 z-10 max-h-screen max-w-[60%] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
        <button
          className="absolute top-0 right-0 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-purple-500/90 opacity-0 hover:bg-purple-800 hover:text-purple-200 group-hover:opacity-100"
          onClick={() => setShowDebugInfo(false)}
        >
          &times;
        </button>
        <details>
          <summary className="cursor-pointer">Helper</summary>
          <div className="flex flex-col gap-1">
            {!!regionPath && (
              <Link
                to={`/regionen/${regionPath}`}
                className="rounded border p-1"
              >
                Reset URL <code>config</code>
              </Link>
            )}
          </div>
        </details>

        <details>
          <summary className="cursor-pointer">Zustand</summary>
          <div className="font-mono">{keyValue(zustandValues)}</div>
        </details>

        <details>
          <summary className="cursor-pointer">Urls</summary>
          <div className="font-mono">getApiUrl: {getApiUrl()}</div>
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
