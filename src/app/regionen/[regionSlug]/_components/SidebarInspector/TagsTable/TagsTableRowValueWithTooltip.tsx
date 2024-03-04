import { TagsTableRowProps } from './TagsTableRow'
import { ValueDisclosure, ValueDisclosureButton, ValueDisclosurePanel } from './ValueDisclosure'
import { ConditionalFormattedValue } from './translations/ConditionalFormattedValue'
import { translations } from './translations/translations.const'

export const TagsTableRowValueWithTooltip = ({
  sourceId,
  tagKey,
  tagValue,
  children,
}: TagsTableRowProps) => {
  const TagValueCell = tagValue && (
    <ConditionalFormattedValue sourceId={sourceId} tagKey={tagKey} tagValue={tagValue} />
  )
  const hasTooltip =
    tagValue && Boolean(translations[`${sourceId}--${tagKey}=${tagValue}--tooltip`])

  if (!hasTooltip) {
    return <>{TagValueCell || children}</>
  }

  return (
    <ValueDisclosure>
      <ValueDisclosureButton>{TagValueCell || children}</ValueDisclosureButton>
      <ValueDisclosurePanel>
        <ConditionalFormattedValue
          sourceId={sourceId}
          tagKey={tagKey}
          tagValue={`${tagValue}--tooltip`}
        />
      </ValueDisclosurePanel>
    </ValueDisclosure>
  )
}
