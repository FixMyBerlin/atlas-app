import { FormattedMessage, IntlProvider } from 'react-intl'
import { getSourceData } from '../../_mapData/utils/getMapDataUtils'
import { extractSourceIdIdFromAtlasGeoSourceKey } from '../utils/sourceKeyUtils/sourceKeyUtilsAtlasGeo'
import { Disclosure } from './Disclosure/Disclosure'
import { InspectorDataFeature } from './Inspector'
import { NoticeMaproulette } from './InspectorFeatureSource/NoticeMaproulette'
import { NoticeTransformedGeometry } from './InspectorFeatureSource/NoticeTransformedGeometry'
import { MapillaryIframe } from './MapillaryIframe/MapillaryIframe'
import { TagsTable } from './TagsTable/TagsTable'
import { translations } from './TagsTable/translations/translations.const'
import { ToolsFreshness } from './Tools/ToolsFreshness'
import { ToolsLinks } from './Tools/ToolsLinks'
import { ToolsOtherProperties } from './Tools/ToolsOtherProperties'
import { ToolsWrapper } from './Tools/ToolsWrapper'
import { Verification } from './Verification/Verification'

export const InspectorFeatureAtlasGeo: React.FC<InspectorDataFeature> = ({
  sourceKey,
  properties,
  geometry,
}) => {
  if (!sourceKey || !properties) return null

  // The documentedKeys info is placed on the source object
  const sourceId = extractSourceIdIdFromAtlasGeoSourceKey(sourceKey)
  const sourceData = getSourceData(sourceId)
  const sourceTranslationKey = extractSourceIdIdFromAtlasGeoSourceKey(sourceKey)

  if (!sourceData.inspector.enabled) return null
  if (!sourceTranslationKey) return null

  return (
    <div className="mt-5 w-full rounded-2xl bg-white">
      <IntlProvider messages={translations} locale="de" defaultLocale="de">
        <Disclosure
          title={<FormattedMessage id={`${sourceTranslationKey}--title`} />}
          objectId={properties.osm_id}
        >
          <NoticeTransformedGeometry visible={properties?.prefix} />
          <NoticeMaproulette
            identifier={properties?.category}
            osmId={properties?.osm_id}
            osmType={properties?.osm_type}
            category={properties?.category}
            geometry={geometry}
          />

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
