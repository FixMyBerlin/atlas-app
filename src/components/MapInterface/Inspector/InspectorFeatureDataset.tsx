import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { DatasetIds } from '../mapData/sourcesMapData/datasets'
import { sourcesDatasets } from '../mapData/sourcesMapData/sourcesDatasets.const'
import { Disclosure } from './Disclosure'
import { InspectorFeature } from './Inspector'
import { TagsTable } from './TagsTable'
import { translations } from './TagsTable/translations'
import { ToolsLinks } from './Tools/ToolsLinks'
import { ToolsOtherProperties } from './Tools/ToolsOtherProperties'
import { ToolsWrapper } from './Tools/ToolsWrapper'
import { extractDataIdIdFromDataKey } from '../Map/SourcesAndLayers/utils/extractFromSourceKey'

export const InspectorFeatureDataset: React.FC<InspectorFeature> = ({
  sourceKey,
  properties,
  geometry,
}) => {
  if (!sourceKey || !properties) return null

  // The documentedKeys info is placed on the source object
  const sourceId = extractDataIdIdFromDataKey(sourceKey) as DatasetIds
  const sourceData = sourcesDatasets.find((dataset) => dataset.id == sourceId)
  const sourceTranslationKey = sourceId

  if (typeof sourceData === 'undefined') return null
  if (!sourceData.inspector.enabled) return null
  if (!sourceTranslationKey) return null

  return (
    <div className="mt-5 w-full rounded-2xl bg-white">
      <IntlProvider messages={translations} locale="de" defaultLocale="de">
        <Disclosure
          title={<FormattedMessage id={`${sourceTranslationKey}--title`} />}
          objectId={properties.osm_id}
        >
          <TagsTable
            properties={properties}
            sourceDocumentedKeys={sourceData.inspector.documentedKeys}
            sourceId={sourceId}
          />

          <ToolsWrapper>
            <ToolsLinks
              properties={properties}
              geometry={geometry}
              editors={sourceData.inspector.editors}
            />
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
