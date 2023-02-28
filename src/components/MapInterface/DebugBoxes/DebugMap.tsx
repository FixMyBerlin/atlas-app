import { getTilesUrl } from '@components/utils'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import { useEffect } from 'react'
import { useMap } from 'react-map-gl'
import { useMapStateInteraction } from '../mapStateInteraction'
import { useMapDebugState } from '../mapStateInteraction/useMapDebugState'

export const DebugMap = () => {
  const {
    showDebugInfo,
    setShowDebugInfo,
    useDebugLayerStyles,
    setUseDebugLayerStyles,
  } = useMapDebugState()
  const { mainMap } = useMap()
  const { mapLoaded } = useMapStateInteraction()

  // The default is to showDebugInfo on isDev.
  // However, we can overwrite this with `?debugMap=true` on production
  const { debugMap } = useSearch<LocationGenerics>()
  useEffect(() => {
    if (debugMap === true) setShowDebugInfo(debugMap)
  }, [debugMap])

  if (!showDebugInfo || !mapLoaded || !mainMap) return null

  const vectorSources = Object.entries(mainMap.getStyle().sources).filter(
    ([_key, value]) => value.type === 'vector'
  )
  const rasterSources = Object.entries(mainMap.getStyle().sources).filter(
    ([_key, value]) => value.type === 'raster'
  )
  const atlasLayers = Object.entries(mainMap.getStyle().layers)
    .filter(
      ([_key, value]) =>
        'source' in value &&
        value.source !== 'openmaptiles' &&
        value.type !== 'raster' // `rasterSources` Layer
    )
    .flat()
    // For some reason the resulting data structure looks like {'104', {id:'etc'}, '105', {id:'etc'}}
    .filter((l) => typeof l !== 'string')

  return (
    <>
      <div className="group absolute top-3 right-[7.5rem] z-10 max-h-[95%] max-w-[60%] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
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
          <summary className="cursor-pointer">Sources</summary>

          <details className="ml-2 border-l border-pink-200 pl-2">
            <summary className="cursor-pointer">
              Vector {Object.keys(vectorSources).length}
            </summary>
            <pre>{JSON.stringify(vectorSources, undefined, 2)}</pre>
          </details>
          <details className="ml-2 border-l border-pink-200 pl-2">
            <summary className="cursor-pointer">
              Raster {Object.keys(rasterSources).length}
            </summary>
            <pre>{JSON.stringify(rasterSources, undefined, 2)}</pre>
          </details>

          <div className="font-mono">getTilesUrl: {getTilesUrl()}</div>
        </details>

        <details>
          <summary className="cursor-pointer">
            Layers {Object.keys(atlasLayers).length}
          </summary>

          {Object.entries(atlasLayers).map(([_key, layer]) => {
            if (typeof layer === 'string') return
            return (
              <details
                key={layer.id}
                className="ml-2 border-l border-pink-200 pl-2"
              >
                <summary className="cursor-pointer">
                  {/* @ts-ignore this weird AnyLayer issue that I don't get worked around… */}
                  {layer?.layout?.visibility === 'none' && '(off)'}
                  {/* @ts-ignore this weird AnyLayer issue that I don't get worked around… */}
                  {layer?.layout?.visibility === 'visible' && '(on)'}{' '}
                  <code>{layer.id}</code>
                </summary>
                <pre>{JSON.stringify(layer, undefined, 2)}</pre>
              </details>
            )
          })}
        </details>
      </div>
    </>
  )
}
