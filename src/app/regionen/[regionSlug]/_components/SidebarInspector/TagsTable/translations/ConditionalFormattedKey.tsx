import React from 'react'
import { FormattedMessage } from 'react-intl'
import { isDev } from 'src/app/_components/utils/isEnv'
import { DatasetIds } from '../../../../_mapData/mapDataSources/datasets/types'
import { SourcesId } from '../../../../_mapData/mapDataSources/sources.const'
import { getDatasetOrSourceData } from '../../../../_mapData/utils/getMapDataUtils'
import { translations } from './translations.const'
import { useRegionDatasets } from '../../../SelectDatasets/utils/useRegionDatasets'

type Props = {
  sourceId: SourcesId | DatasetIds
  tagKey: string
}

export const ConditionalFormattedKey: React.FC<Props> = ({ sourceId, tagKey }) => {
  let key = `${sourceId}--${tagKey}--key`

  // Some data should not be "translated"; we want to show the raw string.
  const regionDatasets = useRegionDatasets()
  const sourceData = getDatasetOrSourceData(sourceId, regionDatasets)
  const showRawValues =
    sourceData &&
    'disableTranslations' in sourceData.inspector &&
    sourceData.inspector.disableTranslations === true
  if (showRawValues) {
    return <code>{tagKey}</code>
  }

  // Some sources have their keys translated already for a different source, so lets look there…
  const lookAtFirstSources: Record<string, string> = {
    'bietigheim-bissingen_on_street_parking_lines': 'parkraumParking',
    'bietigheim-bissingen_parking_areas': 'parkraumParkingAreas',
  }
  const lookAtThisSourceFirst = Object.keys(lookAtFirstSources).find((s) => s === sourceId)
  if (lookAtThisSourceFirst) {
    const keyCandidate = `${sourceId.replace(
      lookAtThisSourceFirst,
      // TODO TS: Why is the "!" required here?
      lookAtFirstSources[lookAtThisSourceFirst]!,
    )}--${tagKey}--key`
    key = translations[keyCandidate] ? keyCandidate : key
  }

  // For some key, we don't want to add translations for each source.
  // For those, we use a simple fallback.
  // (Unfortunatelly react-intl. does not support nested FormattedMessage components to handle the fallbacks.)
  const simpleTranslFallbackKeys = [
    '_parent_highway',
    'composit_surface_smoothness',
    'composit_mapillary',
    'highway',
    'name',
    'description',
    'oneway',
    'osm_traffic_sign',
    'osm_traffic_sign:forward',
    'osm_traffic_sign:backward',
    'width',
    'maxspeed',
  ]
  if (simpleTranslFallbackKeys.includes(tagKey)) {
    key = `ALL--${tagKey}--key`
  }

  // It will take a while to translate everything. This fallback does look better on production.
  const defaultMessage = isDev ? key : tagKey

  return <FormattedMessage id={key} defaultMessage={defaultMessage} />
}
