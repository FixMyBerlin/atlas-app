import { SourcesIds } from '@components/MapInterface/mapData'
import { isDev, isStaging } from '@components/utils'
import React from 'react'
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl'

type Props = {
  sourceId: SourcesIds
  tagKey: string
  tagValue: string
}

export const ConditionalFormattedValue: React.FC<Props> = ({ sourceId, tagKey, tagValue }) => {
  // Some values shall be exposed as is, since they are untranslatable (`name`) or translated in `atlas-geo`.
  const categoryTranslatedAlready = sourceId == 'tarmac_poiClassification' && tagKey == 'category'
  if (['name', 'highway_name'].includes(tagKey) || categoryTranslatedAlready) {
    return <>{tagValue}</>
  }

  // https://formatjs.io/docs/react-intl/components/#formattednumber
  const numberConfigs: { key: string; suffix?: string }[] = [
    { key: 'capacity', suffix: undefined },
    { key: 'highway_width_proc_effective', suffix: 'm' }, // parkraumParkingStats
    { key: 'length', suffix: 'm' },
    { key: 'maxspeed', suffix: 'km/h' },
    { key: 'population', suffix: 'Einwohner:innen' },
    { key: 'width', suffix: 'm' },
    { key: 'sum_km', suffix: 'km' }, // parkraumParkingStats
    { key: 'lane_km', suffix: 'km' }, // parkraumParkingStats
    { key: 'd_other_km', suffix: 'km' }, // parkraumParkingStats
    { key: 'street_side_km', suffix: 'km' }, // parkraumParkingStats
    { key: 'length_wo_dual_carriageway', suffix: 'km' }, // parkraumParkingStats
    { key: 'done_percent', suffix: '%' }, // parkraumParkingStats
    { key: 'admin_level', suffix: undefined },
  ]
  const numberConfig = numberConfigs.find((c) => c.key === tagKey)
  if (numberConfig) {
    return (
      <>
        <FormattedNumber value={parseFloat(tagValue)} /> {numberConfig.suffix}
      </>
    )
  }

  const dateKeys = ['population:date']
  if (dateKeys.includes(tagKey)) {
    return (
      <span className="group">
        <FormattedDate value={tagValue} />{' '}
        <code className="text-gray-50 group-hover:text-gray-600">{tagValue}</code>
      </span>
    )
  }

  let key = `${sourceId}--${tagKey}=${tagValue}`

  // Some keys are a duplicate of other Keys.
  // We want them translated only once, so we overwrite them here…
  const keyOverwrites: Record<string, string> = { _parent_highway: 'highway' }
  if (Object.keys(keyOverwrites).includes(tagKey)) {
    tagKey = keyOverwrites[tagKey]
  }

  // Some TagKeys are not specific per category; we only translate those once
  const nonCategorizedTagKeys = ['_parent_highway', 'highway', 'oneway', 'smoothness', 'surface']
  if (nonCategorizedTagKeys.includes(tagKey)) {
    key = `ALL--${tagKey}=${tagValue}`
  }

  // Some keys are translated already for a different key else, so lets look there first…
  const lookThere: Record<string, string> = {
    self: 'LEFTRIGHTSELF',
    left: 'LEFTRIGHTSELF',
    right: 'LEFTRIGHTSELF',
  }
  const lookThereEntryKey = Object.keys(lookThere).find((k) => k === tagKey)
  if (lookThereEntryKey) {
    key = key.replace(lookThereEntryKey, lookThere[lookThereEntryKey])
  }

  // It will take a while to translate everything. This fallback does look better on production.
  const defaultMessage = isDev || isStaging ? key : tagValue

  return <FormattedMessage id={key} defaultMessage={defaultMessage} />
}
