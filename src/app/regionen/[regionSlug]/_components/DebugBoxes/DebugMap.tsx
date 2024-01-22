import { StyleSpecification } from 'maplibre-gl'
import { useState } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { getTilesUrl } from 'src/app/_components/utils/getTilesUrl'
import { twJoin } from 'tailwind-merge'
import { useInteractiveLayers } from '../Map/utils/useInteractiveLayers'
import { useMapDebugState } from '../../_hooks/mapStateInteraction/useMapDebugState'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { DebugMapDownload } from './DebugMapDownload'

export const DebugMap = () => {
  const { showDebugInfo, setShowDebugInfo, useDebugLayerStyles, setUseDebugLayerStyles } =
    useMapDebugState()
  const { mainMap } = useMap()
  const { mapLoaded } = useMapStateInteraction()
  const [_triggerRerender, setTriggerRerender] = useState(0)

  const interactiveLayerIds = useInteractiveLayers()

  const handleRerender = () => setTriggerRerender((prev) => prev + 1)

  if (!showDebugInfo || !mapLoaded || !mainMap) return null

  // There are situations, when all our guards are not enough and `mainMap.getStyle()` still errors.
  // One way to force this is: (1) open /regionen/bibi, (2) Goto "Acount bearbeiten", (3) Save the form, (4) Use the browser back to show the map again.
  let getStyles: StyleSpecification | undefined = undefined
  try {
    getStyles = mainMap.getStyle()
  } catch (error) {
    console.warn('DebugMap', { error })
    return null
  }

  const allSources = getStyles?.sources
  const allLayers = getStyles?.layers
  if (!allSources || !allLayers) return null

  const vectorSources = Object.entries(allSources).filter(([_, value]) => value.type === 'vector')
  const rasterSources = Object.entries(allSources).filter(([_, value]) => value.type === 'raster')
  const atlasLayers = allLayers
    .filter((layer) => {
      return 'source' in layer && layer.source !== 'openmaptiles' && layer.type !== 'raster'
    })
    .flat()
  if (!vectorSources || !rasterSources || !atlasLayers) return null

  return (
    <div className="group absolute right-[8.5rem] top-3 z-30 max-h-[95%] max-w-[25rem] space-y-0.5 overflow-y-auto rounded bg-pink-300 px-2 py-2 text-[10px] shadow-xl">
      <button
        className="absolute right-0 top-0 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-purple-500/90 opacity-0 hover:bg-purple-800 hover:text-purple-200 group-hover:opacity-100"
        onClick={() => setShowDebugInfo(false)}
      >
        &times;
      </button>

      <button
        onClick={() => setUseDebugLayerStyles(!useDebugLayerStyles)}
        className="rounded border px-1"
      >
        Debug Style {useDebugLayerStyles ? 'ON' : 'OFF'}
      </button>

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
                className={twJoin(
                  layer?.layout?.visibility === 'visible' ? 'font-semibold' : '',
                  'cursor-pointer truncate hover:font-semibold',
                )}
                title={layer.id}
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
