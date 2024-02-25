import React from 'react'
import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { TagsTableRow } from '../TagsTableRow'
import { CompositTableRow } from './types'

export const tableKeyWikipedia = 'wikipedia'
export const TagsTableRowWikipedia: React.FC<CompositTableRow> = ({
  sourceId,
  tagKey,
  properties,
}) => {
  if (!properties['wikipeida']) return null

  return (
    <TagsTableRow
      key={tagKey}
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <LinkExternal blank href={`https://de.wikipedia.org/wiki/${properties['wikipeida']}`}>
          {properties['wikipeida']}
        </LinkExternal>
      }
    />
  )
}
