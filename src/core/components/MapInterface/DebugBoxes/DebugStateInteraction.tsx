import { Routes } from '@blitzjs/next'
import { useConfigParam } from 'src/core/useQueryState/useConfigParam'
import { getApiUrl, isDev, isProd, isStaging } from 'src/core/utils'
import { Link } from '../../links'
import { useRegionSlug } from '../../regionUtils/useRegionSlug'
import { useMapStateInteraction } from '../mapStateInteraction'
import { useMapDebugState } from '../mapStateInteraction/useMapDebugState'
import { useDrawParam } from 'src/core/useQueryState/useDrawParam'

export const DebugStateInteraction = () => {
  const regionSlug = useRegionSlug()
  const zustandValues = useMapStateInteraction()
  const { showDebugInfo, setShowDebugInfo } = useMapDebugState()
  const { configParam } = useConfigParam()
  const { drawParam } = useDrawParam()
  // const { config: configThemes, draw: drawAreasStore } = useSearch<LocationGenerics>()

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
      <div className="group absolute top-3 right-12 z-10 max-h-[95%] max-w-[60%] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
        <button
          className="absolute top-0 right-0 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-purple-500/90 opacity-0 hover:bg-purple-800 hover:text-purple-200 group-hover:opacity-100"
          onClick={() => setShowDebugInfo(false)}
        >
          &times;
        </button>
        <details>
          <summary className="cursor-pointer">Helper</summary>
          <div className="flex flex-col gap-1">
            <Link href={Routes.ShowRegionPage({ regionSlug })} className="rounded border p-1">
              Reset URL <code>config</code>
            </Link>
          </div>
          <div className="font-mono">getApiUrl: {getApiUrl()}</div>
          <div className="font-mono">isDev: {JSON.stringify(isDev)}</div>
          <div className="font-mono">isStaging: {JSON.stringify(isStaging)}</div>
          <div className="font-mono">isProduction: {JSON.stringify(isProd)}</div>
        </details>

        <details>
          <summary className="cursor-pointer">Zustand</summary>
          <div className="font-mono">{keyValue(zustandValues)}</div>
        </details>

        <details>
          <summary className="cursor-pointer">URL Config</summary>
          <pre>{JSON.stringify(configParam, undefined, 2)}</pre>
        </details>

        {Boolean(drawParam?.length) &&
          drawParam?.map((draw) => {
            return (
              <details key={draw.id}>
                <summary className="cursor-pointer">{draw.id}</summary>
                <pre>{JSON.stringify(draw, undefined, 2)}</pre>
              </details>
            )
          })}
      </div>
    </>
  )
}
