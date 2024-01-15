import React from 'react'
import { TagsTableRow } from '../TagsTableRow'
import { CompositTableRow } from './types'
import { ConditionalFormattedValue } from '../translations/ConditionalFormattedValue'
import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { mapillaryKeyUrl } from '../../Tools/osmUrls/osmUrls'

export const tableKeyMapillary = 'composit_mapillary'
export const TagsTableRowCompositMapillary: React.FC<CompositTableRow> = ({
  sourceId,
  tagKey,
  properties,
}) => {
  const url = mapillaryKeyUrl(properties['osm_mapillary'])
  if (!url) return null

  return (
    <TagsTableRow
      key={tagKey}
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <LinkExternal blank href={url}>
          In OSM hinterlegtes Straßenfoto anzeigen…
        </LinkExternal>
      }
    />
  )
}
