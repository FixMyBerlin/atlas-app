import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { extractSourceIdIdFromSourceKey } from '../Map/SourceAndLayers/utils/extractFromSourceKey'
import { getSourceData } from '../mapData'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'
import { Disclosure } from './Disclosure'
import { InspectorHeader } from './InspectorHeader'
import { Links } from './Links'
import { MapillaryIframe } from './MapillaryIframe/MapillaryIframe'
import { OtherProperties } from './OtherProperties'
import { StatusTableAndVerification } from './StatusTableAndActions/StatusTableAndVerification'
import { TagsTable } from './TagsTable'
import { translations } from './TagsTable/translations'

export const Inspector: React.FC = () => {
  const { inspectorFeatures, resetInspector } = useMapStateInteraction()

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
          layer: { source: sourceKey },
          properties,
        } = inspectObject

        if (!properties || !sourceKey) return null

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
        const disclosureTranslationString = sourceKey
          // @ts-ignore I don't get the TS guiard working :-/
          .split('--')
          .at(0)
          .replace('source:', '')

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
                title={
                  <FormattedMessage
                    id={`${disclosureTranslationString}--title`}
                  />
                }
                objectId={properties.osm_id}
              >
                {properties.prefix && (
                  <details className="prose prose-sm bg-purple-100 p-1 py-1.5 px-4">
                    <summary>Hinweis: Transformierte Geometrie</summary>
                    <p className="my-0 ml-3">
                      Diese Geometrie wurde im Rahmen der Datenaufbereitung
                      künstlich erstellt. In OpenStreetMap sind die Daten an der
                      Straßen-Geometrie erfasst. Durch die Datenaufbereitung
                      können die Attribute kompfortabler analysiert und geprüft
                      werden. Sie sorgt aber auch dafür, dass Verbindungspunkte
                      kleine Kanten und Lücken aufweisen können.
                    </p>
                  </details>
                )}

                <MapillaryIframe properties={properties} sourceId={sourceId} />

                <div className="py-1">{/* Spacer */}</div>
                <TagsTable
                  properties={properties}
                  sourceDocumentedKeys={sourceData.inspector.documentedKeys}
                  sourceId={sourceId}
                />

                <Links
                  properties={properties}
                  geometry={inspectObject.geometry}
                  editors={sourceData.inspector.editors}
                />

                <OtherProperties
                  properties={properties}
                  documentedKeys={sourceData.inspector.documentedKeys}
                />

                <StatusTableAndVerification
                  properties={properties}
                  sourceId={sourceId}
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
