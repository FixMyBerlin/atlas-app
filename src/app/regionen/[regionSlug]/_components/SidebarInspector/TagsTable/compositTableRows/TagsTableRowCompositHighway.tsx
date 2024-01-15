import React from 'react'
import { TagsTableRow } from '../TagsTableRow'
import { CompositTableRow } from './types'
import { ConditionalFormattedValue } from '../translations/ConditionalFormattedValue'

export const tableKeyHighway = 'composit_highway'
export const TagsTableRowCompositHighway: React.FC<CompositTableRow> = ({
  sourceId,
  tagKey: _, // is `composit_highway` which is not helpful here
  properties,
}) => {
  if (properties['_parent_highway']) {
    return (
      <TagsTableRow
        sourceId={sourceId}
        tagKey={'_parent_highway'}
        value={
          <ConditionalFormattedValue
            sourceId={sourceId}
            tagKey={'highway'}
            tagValue={properties['_parent_highway']}
          />
        }
      />
    )
  }
  if (properties['highway']) {
    return (
      <TagsTableRow
        sourceId={sourceId}
        tagKey={'highway'}
        value={
          <ConditionalFormattedValue
            sourceId={sourceId}
            tagKey={'highway'}
            tagValue={properties['highway']}
          />
        }
      />
    )
  }
  return null
}
