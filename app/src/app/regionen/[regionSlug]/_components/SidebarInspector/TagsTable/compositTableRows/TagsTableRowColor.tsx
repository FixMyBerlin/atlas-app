import dompurify from 'dompurify'
import { TagsTableRow } from '../TagsTableRow'
import { KEY_IF_PRESENCE, cleanKey } from '../utils/cleanKey'
import { CompositTableRow } from './types'

export const tableKeyColor = 'colour'
export const tableKeyColors = 'colours'
export const TagsTableRowColor = ({
  sourceId,
  tagKey: uncleanKey,
  properties,
}: CompositTableRow) => {
  const tagKey = cleanKey(uncleanKey)
  const values = dompurify.sanitize(properties[tagKey]).split(';').filter(Boolean)
  if (values.length === 0) {
    if (uncleanKey.includes(KEY_IF_PRESENCE)) return null
    return <TagsTableRow sourceId={sourceId} tagKey={tagKey} tagValue={null} />
  }

  return (
    <TagsTableRow sourceId={sourceId} tagKey={tagKey}>
      <div className="flex items-center gap-2">
        {values.map((color) => (
          <div key={color} style={{ backgroundColor: color }} className="h-5 w-5 rounded-full" />
        ))}
        {values.join(', ')}
      </div>
    </TagsTableRow>
  )
}
