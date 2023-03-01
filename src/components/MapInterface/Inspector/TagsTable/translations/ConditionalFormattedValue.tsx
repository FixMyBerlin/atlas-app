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
    'maxspeed',
  ]
  if (numberKeys.includes(tagKey)) {
    return <FormattedNumber value={parseInt(tagValue)} />
  }

  const dateKeys = ['population:date']
  if (dateKeys.includes(tagKey)) {
    return <FormattedDate value={tagValue} />
  }

  let key = `value--${sourceId}--${tagKey}--${tagValue}`

  // Some keys are a duplicate of other Keys.
  // We want them translated only once, so we overwrite them here…
  const keyOverwrites: Record<string, string> = { _parent_highway: 'highway' }
  if (Object.keys(keyOverwrites).includes(tagKey)) {
    tagKey = keyOverwrites[tagKey]
  }

  // Some TagKeys are not specific per category; we only translate those once
  const nonCategorizedTagKeys = [
    'highway',
    '_parent_highway',
    'surface',
    'smoothness',
    'left',
    'right',
    'oneway',
  ]
  if (nonCategorizedTagKeys.includes(tagKey)) {
    key = `value--${tagKey}--${tagValue}`
  }

  // It will take a while to translate everything. This fallback does look better on production.
  const defaultMessage = isDev ? key : tagValue

  return <FormattedMessage id={key} defaultMessage={defaultMessage} />
}
