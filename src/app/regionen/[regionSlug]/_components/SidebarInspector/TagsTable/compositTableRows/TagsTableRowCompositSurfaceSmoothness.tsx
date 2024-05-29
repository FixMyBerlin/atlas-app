import { TagsTableRow } from '../TagsTableRow'
import { ValueDisclosure, ValueDisclosureButton, ValueDisclosurePanel } from '../ValueDisclosure'
import { ConditionalFormattedValue } from '../translations/ConditionalFormattedValue'
import { NodataFallbackWrapper } from './NodataFallbackWrapper'
import { CompositTableRow } from './types'

export const tableKeySurfaceSmoothness = 'composit_surface_smoothness'
export const TagsTableRowCompositSurfaceSmoothness = ({
  sourceId,
  tagKey,
  properties,
}: CompositTableRow) => {
  if (!(properties['smoothness'] || properties['surface'])) return null

  return (
    <TagsTableRow key={tagKey} sourceId={sourceId} tagKey={tagKey}>
      <table className="w-full leading-4">
        <tbody>
          <tr>
            <th className="py-1 pr-2 text-left font-medium">Belag</th>
            <td className="w-full py-1">
              <NodataFallbackWrapper fallback={!Boolean(properties['surface'])}>
                <ValueDisclosure>
                  <ValueDisclosureButton>
                    <ConditionalFormattedValue
                      sourceId={sourceId}
                      tagKey={'surface'}
                      tagValue={properties['surface']}
                    />
                  </ValueDisclosureButton>
                  <ValueDisclosurePanel>
                    <p>
                      <em>Quelle:</em>{' '}
                      <ConditionalFormattedValue
                        sourceId={sourceId}
                        tagKey={'surface_source'}
                        tagValue={properties['surface_source']}
                      />
                    </p>
                    <p>
                      <em>Genauigkeit der Quelle:</em>{' '}
                      <NodataFallbackWrapper fallback={!Boolean(properties['surface_source'])}>
                        Hoch
                      </NodataFallbackWrapper>
                    </p>
                  </ValueDisclosurePanel>
                </ValueDisclosure>
              </NodataFallbackWrapper>
            </td>
          </tr>
          <tr className="border-t">
            <th className="py-1 pr-2 text-left font-medium">Zustand</th>
            <td className="w-full py-1">
              <NodataFallbackWrapper fallback={!Boolean(properties['smoothness'])}>
                <ValueDisclosure>
                  <ValueDisclosureButton>
                    <ConditionalFormattedValue
                      sourceId={sourceId}
                      tagKey={'smoothness'}
                      tagValue={properties['smoothness']}
                    />
                  </ValueDisclosureButton>
                  <ValueDisclosurePanel>
                    <p>
                      <em>Quelle:</em>{' '}
                      <ConditionalFormattedValue
                        sourceId={sourceId}
                        tagKey={'smoothness_source'}
                        tagValue={properties['smoothness_source']}
                      />
                    </p>
                    <p>
                      <em>Genauigkeit der Quelle:</em>{' '}
                      <ConditionalFormattedValue
                        sourceId={sourceId}
                        tagKey={'confidence'}
                        tagValue={properties['smoothness_confidence']}
                      />
                    </p>
                  </ValueDisclosurePanel>
                </ValueDisclosure>
              </NodataFallbackWrapper>
            </td>
          </tr>
        </tbody>
      </table>
    </TagsTableRow>
  )
}
