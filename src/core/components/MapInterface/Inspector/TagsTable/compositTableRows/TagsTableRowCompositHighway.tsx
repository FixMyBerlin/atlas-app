import React from 'react'
import { TagsTableRow } from '../TagsTableRow'
import { ConditionalFormattedValue } from '../translations'
import { CompositTableRow } from './types'

export const tableKeyHighway = 'composit_highway'
export const TagsTableRowCompositHighway: React.FC<CompositTableRow> = ({
  sourceId,
  tagKey,
  properties,
}) => {
  if (!properties['highway'] && !properties['_parent_highway']) return null

  const precedenceHighway = properties['_parent_highway'] || properties['highway']

  return (
    <TagsTableRow
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <ConditionalFormattedValue
          sourceId={sourceId}
          tagKey={'highway'}
          tagValue={precedenceHighway}
        />
      }
    />
  )
}
