import React from 'react'
import { getTopicData } from '../mapData'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'
import { Disclosure } from './Disclosure'
import { InspectorHeader } from './InspectorHeader'
import { extractTopicIdFromSourceKey } from './utils'
import { Verification } from './Verification'

export const Inspector: React.FC = () => {
  const { inspectorFeatures, setInspector } = useMapStateInteraction()
  if (!inspectorFeatures) return null

  // const {setInspectorOpenDisclosures, getInspectorOpenDisclosure} = useMapStateInteraction()

  const createLayerPropertyKey = (
    layerId: string,
    propertyId: string | undefined,
    wayId: string | undefined
  ) => `${layerId}-${propertyId}-${wayId}`

  // For some reason from time to time we get duplicated entires wich cause a `key` warning
  const tempInspectorFeatureKeysForFilter = inspectorFeatures.map((f) =>
    createLayerPropertyKey(f.layer.id, f?.properties?.id, f?.properties?.way_id)
  )
  const uniqInspectorFeatures = inspectorFeatures.filter((f) => {
    const currentKey = createLayerPropertyKey(
      f.layer.id,
      f?.properties?.id,
      f?.properties?.way_id
    )
    return tempInspectorFeatureKeysForFilter.includes(currentKey)
  })
  if (!uniqInspectorFeatures?.length) return null

  return (
    <div className="absolute top-0 right-0 bottom-0 z-10 min-w-[35rem] max-w-[35rem] overflow-y-scroll bg-white p-5 pr-3 shadow-md">
      <InspectorHeader
        count={uniqInspectorFeatures.length}
        handleClose={() => setInspector(null)}
      />

      {uniqInspectorFeatures.map((inspectObject) => {
        const {
          layer: { id: layerKey, source: sourceKey },
          properties,
        } = inspectObject

        if (!properties || !layerKey || !sourceKey) return null

        // The allowVerify info is placed on the topic object, which we only have indirect access to…
        const topicId = extractTopicIdFromSourceKey(sourceKey.toString())
        const topicData = getTopicData(topicId)
        const allowVerify = topicData?.allowVerify || false

        const debuggingKeys = [
          'osm_id',
          'osm_type',
          'osm_url',
          '_skip',
          '_skipNotes',
          'version',
        ]
        const sortedCleanedPropertyKeys = Object.keys(properties)
          .sort()
          .filter((key) => !debuggingKeys.includes(key))
        const sortedDebuggingKeys = Object.keys(properties)
          .sort()
          .filter((key) => debuggingKeys.includes(key))

        return (
          <div
            key={createLayerPropertyKey(
              layerKey,
              properties.id,
              properties.way_id
            )}
            className="mt-5 w-full rounded-2xl bg-white"
          >
            <Disclosure
              title={`Layer ${sourceKey}; Segement ${properties.osm_id}`}
            >
              <table className="w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {/*  Key  */}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-1.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Wert
                    </th>
                    <th
                      scope="col"
                      className="relative py-1.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Aktionen</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedCleanedPropertyKeys.map((key) => {
                    const value = properties[key]
                    return (
                      <tr key={key}>
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {key}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                          <code>
                            {typeof value == 'boolean'
                              ? JSON.stringify(value)
                              : value}
                          </code>
                        </td>
                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          {/*  <a href="#" className="text-indigo-600 hover:text-indigo-900">
            Edit<span className="sr-only">, {person.name}</span>
          </a>  */}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {!!sortedDebuggingKeys.length && (
                <div className="border-t bg-white px-4 py-2.5 text-xs">
                  <details>
                    <summary>System-Werte</summary>
                    {sortedDebuggingKeys.map((key) => {
                      const value = properties[key]
                      return (
                        <p key={key}>
                          <code>
                            {key}: {value}
                          </code>
                        </p>
                      )
                    })}
                  </details>
                </div>
              )}

              <Verification
                visible={allowVerify}
                sourceKey={sourceKey.toString()}
              />
            </Disclosure>
          </div>
        )
      })}
    </div>
  )
}
