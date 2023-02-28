import { getTilesUrl } from '@components/utils'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import { useEffect } from 'react'
import { useMapDebugState } from '../mapStateInteraction/useMapDebugState'

export const DebugMap = () => {
  const {
    showDebugInfo,
    setShowDebugInfo,
    useDebugLayerStyles,
    setUseDebugLayerStyles,
  } = useMapDebugState()

  // The default is to showDebugInfo on isDev.
  // However, we can overwrite this with `?debugMap=true` on production
  const { debugMap } = useSearch<LocationGenerics>()
  useEffect(() => {
    if (debugMap === true) setShowDebugInfo(debugMap)
  }, [debugMap])

  if (!showDebugInfo) return null

  return (
    <>
      <div className="group absolute top-3 right-[7.5rem] z-10 max-h-screen max-w-[60%] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
        <button
          className="absolute top-0 right-0 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-purple-500/90 opacity-0 hover:bg-purple-800 hover:text-purple-200 group-hover:opacity-100"
          onClick={() => setShowDebugInfo(false)}
        >
          &times;
        </button>
        <details>
          <summary className="cursor-pointer">Helper</summary>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setUseDebugLayerStyles(!useDebugLayerStyles)}
              className="rounded border p-1"
            >
              Toggle Debug Style {useDebugLayerStyles ? 'ON' : 'OFF'}
            </button>
          </div>
        </details>

        <details>
          <summary className="cursor-pointer">Urls</summary>
          <div className="font-mono">getTilesUrl: {getTilesUrl()}</div>
        </details>
      </div>
    </>
  )
}
