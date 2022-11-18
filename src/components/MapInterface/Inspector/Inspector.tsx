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
import {
  ConditionalFormattedKey,
  ConditionalFormattedValue,
  translations,
} from './translations'
import { Verification } from './Verification'

export const Inspector: React.FC = () => {
  const { inspectorFeatures, resetInspector } = useMapStateInteraction()
  if (!inspectorFeatures.length) return null

  // const {setInspectorOpenDisclosures, getInspectorOpenDisclosure} = useMapStateInteraction()

  // Uniqueness check: For some reason from time to time we get duplicated entires wich cause a `key` warning
  const renderedLayerPropertyKeys: string[] = []

  return (
    <div className="absolute top-0 right-0 bottom-0 z-10 w-[35rem] overflow-y-scroll bg-white p-5 pr-3 shadow-md">
      <InspectorHeader
        count={inspectorFeatures.length}
        handleClose={() => resetInspector()}
      />

      {inspectorFeatures.map((inspectObject) => {
        const {
          layer: { id: layerKey, source: sourceKey },
          properties,
        } = inspectObject

        if (!properties || !layerKey || !sourceKey) return null

        // The documentedKeys info is placed on the source object
        const sourceId = extractSourceIdIdFromSourceKey(sourceKey.toString())
        const sourceData = getSourceData(sourceId)

        // Uniqueness check:
        const layerPropertyKey = `${sourceKey}-${
          properties[sourceData?.highlightingKey || 'osm_id']
        }`
        if (renderedLayerPropertyKeys.includes(layerPropertyKey)) {
          return null
        }
        renderedLayerPropertyKeys.push(layerPropertyKey)

        // The allowVerify info is placed on the topic object, which we only have indirect access to…
        const topicId = extractTopicIdFromSourceKey(sourceKey.toString())
        const topicData = getTopicData(topicId)
        const allowVerify = topicData?.allowVerify || false

        const documentedProperties = Object.fromEntries(
          Object.entries(properties)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .filter(([key, _v]) => sourceData?.documentedKeys?.includes(key))
        )

        return (
          <div
            key={layerPropertyKey}
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {sourceData?.documentedKeys?.map((key) => {
                      const value = documentedProperties[key]
                      return (
                        <tr key={key} className="group">
                          <td className="w-2/5 py-2 pl-4 pr-3 text-sm font-medium text-gray-900">
                            <ConditionalFormattedKey
                              sourceId={sourceId}
                              tagKey={key}
                              tagValue={value}
                            />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500">
                            {value ? (
                              <ConditionalFormattedValue
                                sourceId={sourceId}
                                tagKey={key}
                                tagValue={value}
                              />
                            ) : (
                              <span className="text-gray-200 group-hover:text-gray-400">
                                Noch keine Daten
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                <StatusTable
                  properties={properties}
                  freshnessDateKey={sourceData?.freshnessDateKey}
                />
                <Links
                  properties={properties}
                  geometry={inspectObject.geometry}
                />
                <OtherProperties
                  properties={properties}
                  documentedKeys={sourceData?.documentedKeys}
                />

                <Verification
                  visible={allowVerify}
                  sourceKey={sourceKey.toString()}
                  objectId={properties.osm_id}
                  verificationStatus={properties.verified}
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
