import { SourcesIds } from '@components/MapInterface/mapData'
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
  if (tagKey === 'name') {
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

  return <FormattedMessage id={`${sourceId}--${tagKey}--${tagValue}`} />
}
