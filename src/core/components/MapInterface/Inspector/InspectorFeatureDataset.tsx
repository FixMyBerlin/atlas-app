import { Quote } from 'src/core/components/text'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { extractDataIdIdFromDataKey } from '../Map/SourcesAndLayers/utils/extractFromSourceKey'
import { sourcesDatasets } from '../mapData/sourcesMapData'
import { DatasetIds } from '../mapData/sourcesMapData/datasets'
import { Disclosure } from './Disclosure'
import { InspectorDataFeature } from './Inspector'
import { TagsTable } from './TagsTable'
import { translations } from './TagsTable/translations'
import { ToolsLinks } from './Tools/ToolsLinks'
import { ToolsOtherProperties } from './Tools/ToolsOtherProperties'
import { ToolsWrapper } from './Tools/ToolsWrapper'

export const InspectorFeatureDataset: React.FC<InspectorDataFeature> = ({
  sourceKey,
  properties,
  geometry,
}) => {
  if (!sourceKey || !properties) return null

  // The documentedKeys info is placed on the source object
  const sourceId = extractDataIdIdFromDataKey(sourceKey) as DatasetIds
  const sourceData = sourcesDatasets.find((dataset) => dataset.id == sourceId)

  if (typeof sourceData === 'undefined') return null
  if (!sourceData.inspector.enabled) return null

  return (
    <div className="mt-5 w-full rounded-2xl bg-white">
      <IntlProvider messages={translations} locale="de" defaultLocale="de">
        <Disclosure
          title={<>Statische Daten {Quote(sourceData.name)}</>}
          objectId={properties.osm_id}
        >
          <p
            dangerouslySetInnerHTML={{ __html: sourceData.attributionHtml }}
            className="border-b py-1.5 pl-4 pr-3 text-gray-400"
          />
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
