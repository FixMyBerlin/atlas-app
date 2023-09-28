import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { getTilesUrl } from 'src/core/utils'
import { useInteractiveLayers } from '../Map/utils/useInteractiveLayers'
import { useMapStateInteraction } from '../mapStateInteraction'
import { useMapDebugState } from '../mapStateInteraction/useMapDebugState'
import { DebugMapDownload } from './DebugMapDownload'

export const DebugMap = () => {
  const { showDebugInfo, setShowDebugInfo, useDebugLayerStyles, setUseDebugLayerStyles } =
    useMapDebugState()
  const { mainMap } = useMap()
  const { mapLoaded } = useMapStateInteraction()
  const [triggerRerender, setTriggerRerender] = useState(0)
  const [atlasLayers, setAtlasLayers] = useState<mapboxgl.AnyLayer[]>([])

  const interactiveLayerIds = useInteractiveLayers()

  const handleRerender = () => setTriggerRerender((prev) => prev + 1)
  useEffect(() => {
    if (!showDebugInfo || !mapLoaded || !mainMap) return

    const allLayers = mainMap.getStyle().layers
    setAtlasLayers(
      allLayers
        .filter((layer) => {
          return 'source' in layer && layer.source !== 'openmaptiles' && layer.type !== 'raster'
        })
        .flat(),
    )
  }, [mapLoaded, mainMap, showDebugInfo, triggerRerender])

  if (!showDebugInfo || !mapLoaded || !mainMap) return null

  const vectorSources = Object.entries(mainMap.getStyle().sources).filter(
    ([_key, value]) => value.type === 'vector',
  )
  const rasterSources = Object.entries(mainMap.getStyle().sources).filter(
    ([_key, value]) => value.type === 'raster',
  )

  return (
    <div className="group absolute top-3 right-[8.5rem] z-10 max-h-[95%] max-w-[25rem] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
      <button
        className="absolute top-0 right-0 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-purple-500/90 opacity-0 hover:bg-purple-800 hover:text-purple-200 group-hover:opacity-100"
        onClick={() => setShowDebugInfo(false)}
      >
        &times;
      </button>

      <details>
        <summary className="cursor-pointer hover:font-semibold">Helper</summary>
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
        <summary className="cursor-pointer hover:font-semibold">Sources</summary>

        <details className="ml-2 border-l border-pink-200 pl-2">
          <summary className="cursor-pointer hover:font-semibold">
            Vector {Object.keys(vectorSources).length}
          </summary>
          <pre>{JSON.stringify(vectorSources, undefined, 2)}</pre>
        </details>
        <details className="ml-2 border-l border-pink-200 pl-2">
          <summary className="cursor-pointer hover:font-semibold">
            Raster {Object.keys(rasterSources).length}
          </summary>
          <pre>{JSON.stringify(rasterSources, undefined, 2)}</pre>
        </details>

        <div className="font-mono">getTilesUrl: {getTilesUrl()}</div>
      </details>

      <DebugMapDownload layers={atlasLayers} />

      <details>
        <summary className="cursor-pointer hover:font-semibold" onClick={handleRerender}>
          Layers {Object.keys(atlasLayers).length}
        </summary>

        <button
          type="button"
          onClick={handleRerender}
          className="p-1 font-bold underline hover:text-pink-700"
        >
          Manually update layers (eg. after filter changes)
        </button>

        {Object.entries(atlasLayers).map(([_key, layer]) => {
          return (
            <details key={layer.id} className="ml-2 border-l border-pink-200 pl-2">
              <summary
                className={clsx(
                  // @ts-ignore this weird AnyLayer issue that I don't get worked around…
                  { 'font-bold': layer?.layout?.visibility === 'visible' },
                  'cursor-pointer hover:font-semibold',
                )}
              >
                {/* @ts-ignore this weird AnyLayer issue that I don't get worked around… */}
                {layer?.layout?.visibility === 'none' && '(off)'}
                {/* @ts-ignore this weird AnyLayer issue that I don't get worked around… */}
                {layer?.layout?.visibility === 'visible' && '(on)'} <code>{layer.id}</code>
              </summary>
              <pre>{JSON.stringify(layer, undefined, 2)}</pre>
            </details>
          )
        })}
      </details>

      <details>
        <summary className="cursor-pointer hover:font-semibold">interactiveLayerIds</summary>

        <ul>
          {interactiveLayerIds.map((layerId) => (
            <li key={`interactiveLayerIds${layerId}`}>{layerId}</li>
          ))}
        </ul>
      </details>
    </div>
  )
}
