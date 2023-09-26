import {
  SourcesIds,
  getDatasetOrSourceData,
} from 'src/core/components--TODO-MIGRATE/MapInterface/mapData'
import { DatasetIds } from 'src/core/components--TODO-MIGRATE/MapInterface/mapData/sourcesMapData/datasets'
import { isDev } from 'src/core/components--TODO-MIGRATE/utils'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { translations } from './translations.const'

type Props = {
  sourceId: SourcesIds | DatasetIds
  tagKey: string
}

export const ConditionalFormattedKey: React.FC<Props> = ({ sourceId, tagKey }) => {
  let key = `${sourceId}--${tagKey}--key`

  // Some data should not be "translated"; we want to show the raw string.
  const sourceData = getDatasetOrSourceData(sourceId)
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
      lookAtFirstSources[lookAtThisSourceFirst],
    )}--${tagKey}--key`
    key = translations[keyCandidate] ? keyCandidate : key
  }

  // For some key, we don't want to add translations for each source.
  // For those, we use a simple fallback.
  // (Unfortunatelly react-intl. does not support nested FormattedMessage components to handle the fallbacks.)
  const simpleTranslFallbackKeys = [
    '_parent_highway',
    'composit_surface_smoothness',
    'highway',
    'name',
    'oneway',
    'traffic_sign',
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
