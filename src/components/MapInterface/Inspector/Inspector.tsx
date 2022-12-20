import { LocationGenerics } from '@routes/routes'
import { useMatch } from '@tanstack/react-location'
import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import {
  extractSourceIdIdFromSourceKey,
  extractTopicIdFromSourceKey,
} from '../Map/SourceAndLayers/utils/extractFromSourceKey'
import { getSourceData, getTopicData } from '../mapData'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'
import { hasPermission, useUserStore } from '../UserInfo'
import { Disclosure } from './Disclosure'
import { InspectorHeader } from './InspectorHeader'
import { Links } from './Links'
import { OtherProperties } from './OtherProperties'
import { StatusTable } from './StatusTable'
import { TagsTable } from './TagsTable'
import { translations } from './TagsTable/translations'
import { VerificationActions } from './VerificationAction'
import { VerificationHistory } from './VerificationHistory'

export const Inspector: React.FC = () => {
  const { inspectorFeatures, resetInspector, localUpdates } =
    useMapStateInteraction()
  const { currentUser } = useUserStore()
  const {
    data: { region },
  } = useMatch<LocationGenerics>()

  if (!inspectorFeatures.length) return null

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
        const allowVerify =
          (topicData?.allowVerify || false) &&
          hasPermission(currentUser, region)

        const localVerificationStatus = [...localUpdates]
          .reverse()
          .find((update) => update.osm_id === properties.osm_id)?.verified

        const verificationStatus =
          localVerificationStatus || properties.verified

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
                <div className="py-1">{/* Spacer */}</div>
                <TagsTable
                  properties={properties}
                  documentedKeys={sourceData?.documentedKeys}
                  sourceId={sourceId}
                />

                <OtherProperties
                  properties={properties}
                  documentedKeys={sourceData?.documentedKeys}
                />
                <Links
                  properties={properties}
                  geometry={inspectObject.geometry}
                />

                <div className="border-t bg-gray-50 px-4 py-2.5">
                  <StatusTable
                    properties={properties}
                    freshnessDateKey={sourceData?.freshnessDateKey}
                    allowVerify={allowVerify}
                    verificationStatus={verificationStatus}
                  />
                  {sourceData?.apiVerificationIdentifier && (
                    <>
                      <VerificationActions
                        apiIdentifier={sourceData.apiVerificationIdentifier}
                        visible={allowVerify}
                        disabled={!properties?.category}
                        osmId={properties.osm_id}
                        verificationStatus={verificationStatus}
                      />
                      <VerificationHistory
                        apiIdentifier={sourceData.apiVerificationIdentifier}
                        visible={
                          allowVerify && verificationStatus !== undefined
                        }
                        osmId={properties.osm_id}
                      />
                    </>
                  )}
                </div>
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
