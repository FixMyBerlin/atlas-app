import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { extractSourceIdIdFromSourceKey } from '../Map/SourcesAndLayers/utils/extractFromSourceKey'
import { getSourceData } from '../mapData'
import { Disclosure } from './Disclosure'
import { InspectorFeature } from './Inspector'
import { MapillaryIframe } from './MapillaryIframe/MapillaryIframe'
import { TagsTable } from './TagsTable'
import { translations } from './TagsTable/translations'
import { ToolsFreshness } from './Tools/ToolsFreshness'
import { ToolsLinks } from './Tools/ToolsLinks'
import { ToolsOtherProperties } from './Tools/ToolsOtherProperties'
import { ToolsWrapper } from './Tools/ToolsWrapper'
import { Verification } from './Verification/Verification'

export const InspectorFeatureSource: React.FC<InspectorFeature> = ({
  sourceKey,
  properties,
  geometry,
}) => {
  if (!sourceKey || !properties) return null

  // The documentedKeys info is placed on the source object
  const sourceId = extractSourceIdIdFromSourceKey(sourceKey)
  const sourceData = getSourceData(sourceId)
  const sourceTranslationKey = extractSourceIdIdFromSourceKey(sourceKey)

  if (!sourceData.inspector.enabled) return null
  if (!sourceTranslationKey) return null

  return (
    <div className="mt-5 w-full rounded-2xl bg-white">
      <IntlProvider messages={translations} locale="de" defaultLocale="de">
        <Disclosure
          title={<FormattedMessage id={`${sourceTranslationKey}--title`} />}
          objectId={properties.osm_id}
        >
          {properties.prefix && (
            <details className="prose prose-sm bg-purple-100 p-1 py-1.5 px-4">
              <summary>Hinweis: Transformierte Geometrie</summary>
              <p className="my-0 ml-3">
                Diese Geometrie wurde im Rahmen der Datenaufbereitung künstlich erstellt. In
                OpenStreetMap sind die Daten an der Straßen-Geometrie erfasst. Durch die
                Datenaufbereitung können die Attribute kompfortabler analysiert und geprüft werden.
                Sie sorgt aber auch dafür, dass Verbindungspunkte kleine Kanten und Lücken aufweisen
                können.
              </p>
            </details>
          )}

          <MapillaryIframe visible={sourceId.includes('mapillary')} properties={properties} />

          <div className="py-1">{/* Spacer */}</div>

          <TagsTable
            properties={properties}
            sourceDocumentedKeys={sourceData.inspector.documentedKeys}
            sourceId={sourceId}
          />

          <Verification properties={properties} sourceId={sourceId} />

          <ToolsWrapper>
            <ToolsLinks
              properties={properties}
              geometry={geometry}
              editors={sourceData.inspector.editors}
            />
            {sourceData.freshness.enabled &&
              sourceData.freshness.freshConfigs?.map((freshConfig) => {
                return (
                  <ToolsFreshness
                    key={freshConfig.dateKey}
                    properties={properties}
                    freshConfig={freshConfig}
                  />
                )
              })}
            <ToolsOtherProperties
              properties={properties}
              documentedKeys={sourceData.inspector.documentedKeys}
            />
          </ToolsWrapper>
        </Disclosure>
      </IntlProvider>
    </div>
  )
}
