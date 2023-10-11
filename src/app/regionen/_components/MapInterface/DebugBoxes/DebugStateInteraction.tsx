'use client'

import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { Link } from 'src/app/_components/links/Link'
import { getApiUrl } from 'src/app/_components/utils/getApiUrl'
import { isDev, isProd, isStaging } from 'src/app/_components/utils/isEnv'
import { useConfigParam } from '../../useQueryState/useConfigParam'
import { useDrawParam } from '../../useQueryState/useDrawParam'
import { useMapDebugState } from '../mapStateInteraction/useMapDebugState'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'

// A custom formatter to get a more compact output
// Prefix [ signals an array, { signals an object
function formatConfig(config: any, indent = 0): string {
  let result = ''
  const keys = Object.keys(config)
  for (const key of keys) {
    const value = config[key]
    const formattedValue = typeof value === 'object' ? formatConfig(value, indent + 2) : value
    const prefix = Array.isArray(value) ? '[ ' : '{ '
    result += `\n${' '.repeat(indent)}${prefix}${key}: ${formattedValue}`
  }
  return result
}

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
      <div className="group absolute right-12 top-3 z-10 max-h-[95%] max-w-[60%] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
        <button
          className="absolute right-0 top-0 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-purple-500/90 opacity-0 hover:bg-purple-800 hover:text-purple-200 group-hover:opacity-100"
          onClick={() => setShowDebugInfo(false)}
        >
          &times;
        </button>
        <details>
          <summary className="cursor-pointer">Helper</summary>
          <div className="flex flex-col gap-1">
            <Link href={`/regionen/${regionSlug}`} className="rounded border p-1">
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
          {Boolean(configParam?.length) &&
            configParam?.map((config) => {
              return (
                <details key={config.id}>
                  <summary className="cursor-pointer">{config.id}</summary>
                  <pre>
                    <code>{formatConfig(config)}</code>
                  </pre>
                </details>
              )
            })}
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
