import { LocationGenerics } from '@routes/routes'
import { useMatch } from '@tanstack/react-location'
import clsx from 'clsx'
import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { extractSourceIdIdFromSourceKey } from '../Map/SourceAndLayers/utils/extractFromSourceKey'
import { getSourceData } from '../mapData'
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

        if (!sourceData.inspector.enabled) return null

        // Uniqueness check:
        const layerPropertyKey = `${sourceKey}-${
          properties[sourceData.inspector.highlightingKey || 'osm_id']
        }`
        if (renderedLayerPropertyKeys.includes(layerPropertyKey)) {
          return null
        }
        renderedLayerPropertyKeys.push(layerPropertyKey)

        const allowVerify =
          (sourceData.verification.enabled || false) &&
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
                {properties._projected_from && (
                  <details className="prose prose-sm rounded bg-purple-100 p-1 py-1.5 px-4">
                    <summary>Hinweis: Projizierte Geometrie</summary>
                    Diese Geometrie wurde im Rahmen der Datenaufbereitung
                    künstlich erstellt. In OpenStreetMap sind die Daten an der
                    Straßen-Geometrie erfasst. Durch die Datenaufbereitung
                    können die Attribute kompfortabler analysiert und geprüft
                    werden. Sie sorgt aber auch dafür, dass Verbindungspunkte
                    kleine Kanten und Lücken aufweisen können.
                  </details>
                )}

                <div className="py-1">{/* Spacer */}</div>
                <TagsTable
                  properties={properties}
                  documentedKeys={sourceData.inspector.documentedKeys}
                  sourceId={sourceId}
                />

                <OtherProperties
                  properties={properties}
                  documentedKeys={sourceData.inspector.documentedKeys}
                />
                <Links
                  properties={properties}
                  geometry={inspectObject.geometry}
                />

                <div
                  className={clsx({
                    'border-t bg-gray-50 px-4 py-2.5':
                      sourceData.presence.enabled ||
                      sourceData.verification.enabled ||
                      sourceData.freshness.enabled,
                  })}
                >
                  <StatusTable
                    visible={
                      sourceData.presence.enabled ||
                      sourceData.verification.enabled ||
                      sourceData.freshness.enabled
                    }
                    properties={properties}
                    freshnessDateKey={sourceData.freshness.dateKey}
                    allowVerify={allowVerify}
                    verificationStatus={verificationStatus}
                  />
                  {sourceData.verification.enabled && (
                    <>
                      <VerificationActions
                        apiIdentifier={sourceData.verification.apiIdentifier}
                        visible={allowVerify}
                        disabled={!properties?.category}
                        osmId={properties.osm_id}
                        verificationStatus={verificationStatus}
                      />
                      <VerificationHistory
                        apiIdentifier={sourceData.verification.apiIdentifier}
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
