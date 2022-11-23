/* eslint-disable react/no-unescaped-entities */
import { MapDataVisLayer } from '@components/MapInterface/mapData'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import { IconModal } from '@components/Modal'
import { isDev } from '@components/utils'
import { CommandLineIcon } from '@heroicons/react/20/solid'
import React from 'react'

type Props = { legendName: string; layers: MapDataVisLayer[] }

export const LegendDebugInfo: React.FC<Props> = ({ legendName, layers }) => {
  const { showDebugInfo } = useMapStateInteraction()

  if (!isDev && !showDebugInfo) return null

  return (
    <div className="ml-2 inline-block bg-pink-300">
      <IconModal
        title={`Debug info for Legends for ${legendName}`}
        titleIcon="info"
        triggerStyle="circle"
        triggerIcon={<CommandLineIcon className="h-4 w-4" />}
      >
        {layers.map((layer) => {
          const { type, paint } = layer
          return (
            <details open key={layer.id} className="prose">
              <summary className="cursor-pointer">
                Layer <code>{layer.id}</code> — Type <code>{type}</code>
              </summary>
              {Object.entries(paint || {}).map(([key, content]) => {
                if (['line-width'].includes(key)) return null
                return (
                  <pre key={key} className="my-0.5 text-xs">
                    paint['{key}']{' '}
                    <span style={{ color: content }}>
                      {JSON.stringify(content, undefined, 2)}
                    </span>
                  </pre>
                )
              })}
            </details>
          )
        })}
      </IconModal>
    </div>
  )
}
