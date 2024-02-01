import { LineString } from '@turf/turf'
import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { Markdown } from 'src/app/_components/text/Markdown'
import {
  categoryToMaprouletteProjectKey,
  taskDescriptionMarkdown,
} from 'src/app/api/maproulette/[projectKey]/_utils/taskMarkdown'
import { getSourceData } from '../../_mapData/utils/getMapDataUtils'
import { extractSourceIdIdFromSourceKey } from '../Map/SourcesAndLayers/utils/extractFromSourceKey/extractFromKey'
import { Disclosure } from './Disclosure/Disclosure'
import { InspectorDataFeature } from './Inspector'
import { MapillaryIframe } from './MapillaryIframe/MapillaryIframe'
import { TagsTable } from './TagsTable/TagsTable'
import { translations } from './TagsTable/translations/translations.const'
import { ToolsFreshness } from './Tools/ToolsFreshness'
import { ToolsLinks } from './Tools/ToolsLinks'
import { ToolsOtherProperties } from './Tools/ToolsOtherProperties'
import { ToolsWrapper } from './Tools/ToolsWrapper'
import { Verification } from './Verification/Verification'

export const InspectorFeatureSource: React.FC<InspectorDataFeature> = ({
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

  const maprouletteProjectKey = categoryToMaprouletteProjectKey(properties.category)

  return (
    <div className="mt-5 w-full rounded-2xl bg-white">
      <IntlProvider messages={translations} locale="de" defaultLocale="de">
        <Disclosure
          title={<FormattedMessage id={`${sourceTranslationKey}--title`} />}
          objectId={properties.osm_id}
        >
          {properties.prefix && (
            <details className="prose prose-sm bg-purple-100 p-1 px-4 py-1.5">
              <summary className="cursor-pointer hover:font-semibold">
                Hinweis: Transformierte Geometrie
              </summary>
              <p className="my-0 ml-3">
                Diese Geometrie wurde im Rahmen der Datenaufbereitung künstlich erstellt. In
                OpenStreetMap sind die Daten an der Straßen-Geometrie erfasst. Durch die
                Datenaufbereitung können die Attribute kompfortabler analysiert und geprüft werden.
                Sie sorgt aber auch dafür, dass Verbindungspunkte kleine Kanten und Lücken aufweisen
                können.
              </p>
            </details>
          )}
          {maprouletteProjectKey && (
            <details className="prose prose-sm border-t border-white bg-purple-100 p-1 px-4 py-1.5">
              <summary className="cursor-pointer hover:font-semibold">
                Kampagne zur Datenverbesserung
              </summary>
              <div className="my-0 ml-3 py-3">
                <Markdown
                  markdown={taskDescriptionMarkdown({
                    projectKey: maprouletteProjectKey,
                    id: properties.osm_id,
                    type: properties.osm_type,
                    category: properties.category,
                    geometry: geometry as LineString,
                  })}
                  className="prose-sm marker:text-purple-700"
                />
              </div>
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
