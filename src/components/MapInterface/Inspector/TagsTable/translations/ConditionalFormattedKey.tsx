import { SourcesIds } from '@components/MapInterface/mapData'
import { DatasetIds } from '@components/MapInterface/mapData/sourcesMapData/datasets'
import { isDev } from '@components/utils'
import React from 'react'
import { FormattedMessage } from 'react-intl'

type Props = {
  sourceId: SourcesIds | DatasetIds
  tagKey: string
}

export const ConditionalFormattedKey: React.FC<Props> = ({ sourceId, tagKey }) => {
  let key = `${sourceId}--${tagKey}--key`

  // Some sources have their keys translated already for a different source, so lets look there…
  const lookThereForSource: Record<string, string> = {
    'bietigheim-bissingen_on_street_parking_lines': 'parkraumParking',
    'bietigheim-bissingen_parking_areas': 'parkraumParkingAreas',
  }
  const lookThereForSourceEntry = Object.keys(lookThereForSource).find((s) => s === sourceId)
  if (lookThereForSourceEntry) {
    key = `${sourceId.replace(
      lookThereForSourceEntry,
      lookThereForSource[lookThereForSourceEntry]
    )}--${tagKey}--key`
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
