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
  // Some values shall be exposed as is, since they are untranslatable (`name`) or translated in `atlas-geo`.
  const categoryTranslatedAlready =
    sourceId == 'tarmac_poiClassification' && tagKey == 'category'
  if (['name', 'highway_name'].includes(tagKey) || categoryTranslatedAlready) {
    return <>{tagValue}</>
  }

  const numberKeys = [
    'population',
    'highway_width_proc_effective',
    'length',
    'capacity',
  ]
  if (numberKeys.includes(tagKey)) {
    return <FormattedNumber value={parseInt(tagValue)} />
  }

  const dateKeys = ['population:date']
  if (dateKeys.includes(tagKey)) {
    return <FormattedDate value={tagValue} />
  }

  // Some TagKeys are not specific per category; we only translate those once
  const nonCategorizedTagKeys = [
    'highway',
    'surface',
    'smoothness',
    'left',
    'right',
    'oneway',
  ]
  const key = nonCategorizedTagKeys.includes(tagKey)
    ? `value--${tagKey}--${tagValue}`
    : `value--${sourceId}--${tagKey}--${tagValue}`

  // It will take a while to translate everything. This fallback does look better on production.
  const defaultMessage = isDev ? key : tagValue
  return <FormattedMessage id={key} defaultMessage={defaultMessage} />
}
