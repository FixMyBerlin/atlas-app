import { SourcesIds } from '@components/MapInterface/mapData'
import { isDev } from '@components/utils'
import React from 'react'
import { FormattedMessage } from 'react-intl'

type Props = {
  sourceId: SourcesIds
  tagKey: string
}

export const ConditionalFormattedKey: React.FC<Props> = ({
  sourceId,
  tagKey,
}) => {
  let key = `${sourceId}--${tagKey}--key`

  // For some key, we don't want to add translations for each source.
  // For those, we use a simple fallback.
  // (Unfortunatelly react-intl. does not support nested FormattedMessage components to handle the fallbacks.)
  const simpleTranslFallbackKeys = [
    '_parent_highway',
    'composit_surface_smoothness',
    'highway',
    'left',
    'name',
    'oneway',
    'right',
    'traffic_sign',
    'width',
  ]
  if (simpleTranslFallbackKeys.includes(tagKey)) {
    key = `ALL--${tagKey}--key`
  }

  // It will take a while to translate everything. This fallback does look better on production.
  const defaultMessage = isDev ? key : tagKey

  return <FormattedMessage id={key} defaultMessage={defaultMessage} />
}
