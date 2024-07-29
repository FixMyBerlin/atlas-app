import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { TagsTableRow } from '../TagsTableRow'
import { CompositTableRow } from './types'

export const tableKeyWebsite = 'website'
export const TagsTableRowWebsite = ({ sourceId, tagKey, properties }: CompositTableRow) => {
  if (!properties[tagKey]) return null

  return (
    <TagsTableRow key={tagKey} sourceId={sourceId} tagKey={tagKey}>
      <LinkExternal blank href={properties[tagKey]}>
        {properties[tagKey].replace('https://', '').replace('http://', '')}
      </LinkExternal>
    </TagsTableRow>
  )
}
