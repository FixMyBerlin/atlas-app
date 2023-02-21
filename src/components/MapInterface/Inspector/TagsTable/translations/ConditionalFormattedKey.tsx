import { SourcesIds } from '@components/MapInterface/mapData'
import { isDev } from '@components/utils'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { translations } from './translations.const'

type Props = {
  sourceId: SourcesIds
  tagKey: string
}

export const ConditionalFormattedKey: React.FC<Props> = ({
  sourceId,
  tagKey,
}) => {
  const key = `key--${sourceId}--${tagKey}`

  // It will take a while to translate everything. This fallback does look better on production.
  let defaultMessage = isDev ? key : tagKey

  // For some key, we don't want to add translations for each source.
  // For those, we use a simple fallback.
  // (Unfortunatelly react-intl. does not support nested FormattedMessage components to handle the fallbacks.)
  const simpleTranslFallbackKeys = [
    'name',
    'highway',
    'left',
    'right',
    'oneway',
  ]
  if (simpleTranslFallbackKeys.includes(tagKey)) {
    defaultMessage = translations[`key--${tagKey}`]
  }

  return <FormattedMessage id={key} defaultMessage={defaultMessage} />
}
