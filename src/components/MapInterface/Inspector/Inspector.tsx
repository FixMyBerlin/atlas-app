import { CloseButton } from '@components/CloseButton'
import classNames from 'classnames'
import React from 'react'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'

export const Inspector: React.FC = () => {
  const { inspectorFeatures, setInspector } = useMapStateInteraction()
  // For some reason from time to time we get duplicated entires wich cause a `key` warning
  if (!inspectorFeatures) return null

  const generateKey = (
    layerId: string,
    propertyId: string | undefined,
    wayId: string | undefined
  ) => `${layerId}-${propertyId}-${wayId}`

  const tempInspectorFeatureKeysForFilter = inspectorFeatures.map((f) =>
    generateKey(f.layer.id, f?.properties?.id, f?.properties?.way_id)
  )

  const uniqInspectorFeatures = inspectorFeatures.filter((f) => {
    const currentKey = generateKey(
      f.layer.id,
      f?.properties?.id,
      f?.properties?.way_id
    )
    return tempInspectorFeatureKeysForFilter.includes(currentKey)
  })

  if (!uniqInspectorFeatures?.length) return null

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

  const addLink = (maybeLink: string, label: React.ReactNode | string) => {
    if (typeof maybeLink !== 'string') return label
    return maybeLink.startsWith('http') ? (
      <a
        href={maybeLink}
        target="_blank"
        className="underline hover:text-blue-500"
        rel="noreferrer"
      >
        {label}
      </a>
    ) : (
      label
    )
  }
  return (
    <div className="absolute top-0 right-0 bottom-0 z-10 min-w-[35rem] max-w-[35rem] overflow-y-auto bg-white p-5 shadow-md">
      <h2 className="text-base font-medium text-gray-900">
        Eigenschaften <span>({uniqInspectorFeatures.length})</span>
      </h2>
      <CloseButton onClick={() => setInspector(null)} />

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
            key={generateKey(layerId, properties.id, properties.way_id)}
            className="prose-sm mb-5 w-full"
          >
            <caption className="" style={{ captionSide: 'top' }}>
              <span className="float-left py-1 px-0.5 font-light text-gray-400">
                {layerId}
              </span>
              {!!todoKeys.length && (
                <span className="float-right mx-0.5 rounded bg-orange-200 px-0.5">
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .maplibregl-ctrl-top-right { right: 490px }
          `,
        }}
      />
    </div>
  )
}
