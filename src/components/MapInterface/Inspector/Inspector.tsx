import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import {
  extractSourceIdIdFromSourceKey,
  extractTopicIdFromSourceKey,
} from '../Map/SourceAndLayers/utils/extractFromSourceKey'
import { getSourceData, getTopicData } from '../mapData'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'
import { Disclosure } from './Disclosure'
import { InspectorHeader } from './InspectorHeader'
import { Links } from './Links'
import { OtherProperties } from './OtherProperties'
import { StatusTable } from './StatusTable'
import { ConditionalFormattedMessage, translations } from './translations'
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
    <div className="absolute top-0 right-0 bottom-0 z-10 w-[35rem] overflow-y-scroll bg-white p-5 pr-3 shadow-md">
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

        // The documentedKeys info is placed on the source object
        const sourceId = extractSourceIdIdFromSourceKey(sourceKey.toString())
        const sourceData = getSourceData(sourceId)

        const documentedProperties = Object.fromEntries(
          Object.entries(properties)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .filter(([key, _v]) => sourceData?.documentedKeys?.includes(key))
        )

        return (
          <div
            key={createLayerPropertyKey(
              layerKey,
              properties.id,
              properties.way_id
            )}
            className="mt-5 w-full rounded-2xl bg-white"
          >
            <IntlProvider
              messages={translations}
              locale="de"
              defaultLocale="de"
            >
              <Disclosure
                title={<FormattedMessage id={`title--${sourceKey}`} />}
                objectId={properties.osm_id}
              >
                <table className="w-full">
                  <thead className="sr-only bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Schlüssel
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
                        Aktionen
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {Object.entries(documentedProperties).map(
                      ([key, value]) => {
                        return (
                          <tr key={key}>
                            <td className="w-2/5 py-2 pl-4 pr-3 text-sm font-medium text-gray-900">
                              <FormattedMessage id={`${sourceId}--${key}`} />
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500">
                              <ConditionalFormattedMessage
                                sourceId={sourceId}
                                tagKey={key}
                                tagValue={value}
                              />
                            </td>
                            <td className="relative py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                              {/*  <a href="#" className="text-indigo-600 hover:text-indigo-900">
            Edit<span className="sr-only">, {person.name}</span>
          </a>  */}
                            </td>
                          </tr>
                        )
                      }
                    )}
                  </tbody>
                </table>

                <StatusTable
                  properties={properties}
                  freshnessDateKey={sourceData?.freshnessDateKey}
                />
                <Links properties={properties} />
                <OtherProperties
                  properties={properties}
                  documentedKeys={sourceData?.documentedKeys}
                />

                <Verification
                  visible={allowVerify}
                  sourceKey={sourceKey.toString()}
                  objectId={properties.osm_id}
                />
              </Disclosure>
            </IntlProvider>
          </div>
        )
      })}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .maplibregl-ctrl-top-right { right: 35rem }
          `,
        }}
      />
    </div>
  )
}
