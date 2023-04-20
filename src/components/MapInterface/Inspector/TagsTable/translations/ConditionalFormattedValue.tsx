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

  let translationKey = `${sourceId}--${tagKey}=${tagValue}`

  // Some keys are a duplicate of other Keys.
  // We want them translated only once, so we overwrite them here…
  const keyOverwrites: Record<string, string> = { _parent_highway: 'highway' }
  if (Object.keys(keyOverwrites).includes(tagKey)) {
    tagKey = keyOverwrites[tagKey]
  }

  // Some sources have their keys translated already for a different key else, so lets look there first…
  // Keys need to be source specific, otherwise there is interference with the next step.
  const lookThere: Record<string, string> = {
    'tarmac_roadClassification--category': 'highway',
  }
  const lookThereEntryKey = Object.keys(lookThere).find((k) => k === `${sourceId}--${tagKey}`)
  if (lookThereEntryKey) {
    tagKey = lookThere[lookThereEntryKey]
    translationKey = `ALL--${lookThere[lookThereEntryKey]}=${tagValue}`
  }

  // Lastly…
  // Some TagKeys are not specific per source; we only translate those once
  const nonCategorizedTagKeys = [
    '_parent_highway',
    'highway',
    'smoothness',
    'surface',
    'category',
    'traffic_sign',
  ]
  if (nonCategorizedTagKeys.includes(tagKey)) {
    translationKey = `ALL--${tagKey}=${tagValue}`
  }

  // It will take a while to translate everything. This fallback does look better on production.
  const defaultMessage = isDev || isStaging ? translationKey : tagValue

  return <FormattedMessage id={translationKey} defaultMessage={defaultMessage} />
}
