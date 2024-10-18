import { LinkExternal } from '@/src/app/_components/links/LinkExternal'
import { TagsTableRow } from '../TagsTableRow'
import { CompositTableRow } from './types'

export const tableKeyWikipedia = 'wikipedia'
export const TagsTableRowWikipedia = ({ sourceId, tagKey, properties }: CompositTableRow) => {
  if (!properties['wikipeida']) return null

  return (
    <TagsTableRow key={tagKey} sourceId={sourceId} tagKey={tagKey}>
      <LinkExternal blank href={`https://de.wikipedia.org/wiki/${properties['wikipeida']}`}>
        {properties['wikipeida']}
      </LinkExternal>
    </TagsTableRow>
  )
}
