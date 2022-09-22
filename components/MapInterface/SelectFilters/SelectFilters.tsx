import React from 'react'
import { SelectEntryCheckbox } from '../components'
import { mapDataConfig, MapDataConfigTopicIds } from '../Map/mapData'
import { cleanupTargetIdFromEvent } from '../Map/utils'
import { addGeschichte, removeGeschichte } from '../store'
import { TopicStyleFilterOptionKey, useQuery } from '../store/geschichte'
import { createTopicStyleFilterOptionKey, splitTopicStyleKey } from '../utils'

type Props = { scopeTopicId: MapDataConfigTopicIds }

export const SelectFilters: React.FC<Props> = ({ scopeTopicId }) => {
  const {
    values: { selectedStyleKeys, selectedStylesFilterOptionKeys },
    pushState,
  } = useQuery()
  const checkboxScope = 'filter'

  const selectedStyleKey = selectedStyleKeys.find((s) =>
    s.startsWith(scopeTopicId)
  )
  if (!selectedStyleKey) return null
  const [_, selectedStyleId] = splitTopicStyleKey(selectedStyleKey)
  const selectedStyle = mapDataConfig.topics
    .find((t) => t.id == scopeTopicId)
    ?.styles.find((s) => s.id == selectedStyleId)

  if (!selectedStyle?.interactiveFilters?.length) return null

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterKey = event.target.value as TopicStyleFilterOptionKey

    if (selectedStylesFilterOptionKeys?.includes(filterKey)) {
      pushState((state) => {
        state.selectedStylesFilterOptionKeys =
          removeGeschichte<TopicStyleFilterOptionKey>(
            state.selectedStylesFilterOptionKeys,
            filterKey
          )
      })
    } else {
      pushState((state) => {
        state.selectedStylesFilterOptionKeys =
          addGeschichte<TopicStyleFilterOptionKey>(
            state.selectedStylesFilterOptionKeys,
            filterKey
          )
      })
    }
  }

  return (
    <section className="mt-1 rounded border px-2 py-2.5">
      {selectedStyle.interactiveFilters.map((filter) => {
        return (
          <fieldset key={selectedStyleKey}>
            <legend className="sr-only">Filter</legend>
            <details className="space-y-2.5">
              <summary className="text-sm">Filter</summary>
              <div className="space-y-2.5">
                {filter.options.map((option) => {
                  const key = createTopicStyleFilterOptionKey(
                    scopeTopicId,
                    selectedStyleId,
                    filter.id,
                    option.id
                  )
                  if (!key) return null
                  const active = selectedStylesFilterOptionKeys.includes(key)
                  // The filter list must have one entry, otherwise the map style fails
                  // so we disable the last active one.
                  const disabled =
                    !!active && selectedStylesFilterOptionKeys.length === 1

                  return (
                    <SelectEntryCheckbox
                      scope={checkboxScope}
                      key={key}
                      id={key}
                      label={option.name}
                      active={active}
                      disabled={disabled}
                      onChange={onChange}
                    />
                  )
                })}
              </div>
            </details>
          </fieldset>
        )
      })}
    </section>
  )
}
