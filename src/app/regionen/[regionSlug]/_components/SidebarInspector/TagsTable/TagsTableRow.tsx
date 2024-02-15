import React from 'react'
import { SourcesId } from '../../../_mapData/mapDataSources/sources.const'
import { NodataFallback } from './compositTableRows/NodataFallback'
import { ConditionalFormattedKey } from './translations/ConditionalFormattedKey'
import { ConditionalFormattedValue } from './translations/ConditionalFormattedValue'

export type TagsTableRowProps =
  | {
      sourceId: SourcesId | string // string = StaticDatasetsIds
      tagKey: string
      tagValue: string
      value?: never
    }
  | {
      sourceId: SourcesId | string // string = StaticDatasetsIds
      tagKey: string
      tagValue?: never
      value: React.ReactNode
    }

export const TagsTableRow: React.FC<TagsTableRowProps> = ({
  sourceId,
  tagKey,
  tagValue,
  value: ValueCell,
}) => {
  const TagValueCell = tagValue && (
    <ConditionalFormattedValue sourceId={sourceId} tagKey={tagKey} tagValue={tagValue} />
  )

  return (
    <tr className="group">
      <td className="w-2/5 py-2 pl-4 pr-3 text-sm font-medium text-gray-900">
        <ConditionalFormattedKey sourceId={sourceId} tagKey={tagKey} />
      </td>
      <td className="px-3 py-2 text-sm text-gray-500">
        {TagValueCell || ValueCell || <NodataFallback />}
      </td>
    </tr>
  )
}
