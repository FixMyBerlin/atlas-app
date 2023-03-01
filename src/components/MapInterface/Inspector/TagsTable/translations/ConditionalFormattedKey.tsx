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
  let key = `key--${sourceId}--${tagKey}`

  // For some key, we don't want to add translations for each source.
  // For those, we use a simple fallback.
  // (Unfortunatelly react-intl. does not support nested FormattedMessage components to handle the fallbacks.)
  const simpleTranslFallbackKeys = [
    'name',
    'highway',
    '_parent_highway',
    'left',
    'right',
    'oneway',
  ]
  if (simpleTranslFallbackKeys.includes(tagKey)) {
    key = `key--${tagKey}`
  }

  // It will take a while to translate everything. This fallback does look better on production.
  const defaultMessage = isDev ? key : tagKey

  return <FormattedMessage id={key} defaultMessage={defaultMessage} />
}
