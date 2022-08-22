import classNames from 'classnames'
import React from 'react'
import { useStore } from 'zustand'
import { useStoreMap } from '../store/useStoreMap'

export const Inspector: React.FC = () => {
  const { inspectorFeatures, setInspector } = useStore(useStoreMap)
  // For some reason from time to time we get duplicated entires wich cause a `key` warning
  if (!inspectorFeatures) return null

  const uniqInspectorFeatures = Array.from(new Set([...inspectorFeatures]))
  if (!uniqInspectorFeatures) return null

  const osmLink = (id: string) => {
    const pathWithId = id.includes('/') ? id : `way/${id}`
    return (
      <a
        href={`https://www.openstreetmap.org/${pathWithId}`}
        target="_blank"
        className="underline hover:text-blue-500"
        rel="noreferrer"
      >
        OSM
      </a>
    )
  }

  return (
    <section>
      <h2 className="text-base font-medium text-gray-900">
        Eigenschaften <span>({uniqInspectorFeatures.length})</span>
      </h2>
      {uniqInspectorFeatures.map((inspectObject) => {
        const {
          layer: { id: layerId },
          properties,
        } = inspectObject
        if (!properties) return null

        const sortedPropertyKeys = Object.keys(properties).sort()
        const todoKeys = sortedPropertyKeys.filter((k) =>
          k.toLocaleLowerCase().split(':').includes('todo')
        )

        return (
          <table
            key={`${layerId}-${properties.id}-${properties.way_id}`}
            className="prose-sm mb-5 w-full"
          >
            <caption className="" style={{ captionSide: 'top' }}>
              <span className="font-light text-gray-400 float-left py-1 px-0.5">
                {layerId}
              </span>
              {!!todoKeys.length && (
                <span className="rounded px-0.5 mx-0.5 bg-orange-200 float-right">
                  {' '}
                  {todoKeys.length} TODO
                </span>
              )}
            </caption>
            <thead>
              <tr className="bg-gray-100">
                <th className="py-0.5 pl-0.5 text-left">key</th>
                <th className="py-0.5 pl-1 text-left">value</th>
              </tr>
            </thead>
            <tbody>
              {sortedPropertyKeys.map((key) => {
                const value = properties[key]
                return (
                  <tr
                    key={key}
                    className={classNames(
                      'border-b border-gray-200 leading-snug',
                      {
                        'bg-orange-100': todoKeys.includes(key),
                      }
                    )}
                  >
                    <td className="w-1/2 break-all p-0">
                      <code>{key}</code>
                    </td>
                    <td className="w-1/2 break-all p-0 pl-1">
                      {addLink(value, <code>{value}</code>)}{' '}
                      {['way_id', '@id'].includes(key) &&
                        osmLink(value.split('.')[0])}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      })}
      <button type="button" onClick={() => setInspector(null)}>
        &times;
      </button>
    </section>
  )
}
