import { TagsTableRow } from '../TagsTableRow'
import { ConditionalFormattedValue } from '../translations/ConditionalFormattedValue'
import { CompositTableRow } from './types'

export const tableKeyHighway = 'composit_highway'
export const TagsTableRowCompositHighway = ({
  sourceId,
  tagKey: _, // is `composit_highway` which is not helpful here
  properties,
}: CompositTableRow) => {
  if (properties['_parent_highway']) {
    return (
      <TagsTableRow sourceId={sourceId} tagKey={'_parent_highway'}>
        <ConditionalFormattedValue
          sourceId={sourceId}
          tagKey={'highway'}
          tagValue={properties['_parent_highway']}
        />
      </TagsTableRow>
    )
  }
  if (properties['highway']) {
    return <TagsTableRow sourceId={sourceId} tagKey={'highway'} tagValue={properties['highway']} />
  }
  return null
}
