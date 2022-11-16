import { SourcesIds } from '@components/MapInterface/mapData'
import { isDev } from '@components/utils'
import React from 'react'
import { FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl'

type Props = {
  sourceId: SourcesIds
  tagKey: string
  tagValue: string
}

export const ConditionalFormattedMessage: React.FC<Props> = ({
  sourceId,
  tagKey,
  tagValue,
}) => {
  const categoryTranslatedAlready =
    sourceId == 'tarmac_poiClassification' && tagKey == 'category'
  if (tagKey === 'name' || categoryTranslatedAlready) {
    return <>{tagValue}</>
  }

  const numberKeys = ['population']
  if (numberKeys.includes(tagKey)) {
    return <FormattedNumber value={parseInt(tagValue)} />
  }

  const dateKeys = ['population:date']
  if (dateKeys.includes(tagKey)) {
    return <FormattedDate value={tagValue} />
  }

  // It will take a while to translate everything. This fallback does look better on production.
  const key = `${sourceId}--${tagKey}--${tagValue}`
  return <FormattedMessage id={key} defaultMessage={isDev ? tagValue : key} />
}
