import { SourcesIds } from '@components/MapInterface/mapData'
import { isDev } from '@components/utils'
import React from 'react'
import { FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl'

type Props = {
  sourceId: SourcesIds
  tagKey: string
  tagValue: string
}

export const ConditionalFormattedValue: React.FC<Props> = ({
  sourceId,
  tagKey,
  tagValue,
}) => {
  // Some values shall be exposed as is, since they are untranslatable (`name`) or translated in `tarmac-geo`.
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

  // Some TagKeys are not specific per category; we only translate those once
  const nonCategorizedTagKeys = ['highway', 'surface', 'smoothness']
  const key = nonCategorizedTagKeys.includes(tagKey)
    ? `value--${tagKey}--${tagValue}`
    : `value--${sourceId}--${tagKey}--${tagValue}`

  // It will take a while to translate everything. This fallback does look better on production.
  const defaultMessage = isDev ? key : tagValue
  return <FormattedMessage id={key} defaultMessage={defaultMessage} />
}
