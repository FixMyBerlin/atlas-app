import React from 'react'
import { SelectEntryCheckbox, SelectEntryRadiobutton } from '../components'
import { mapDataConfig, MapDataConfigTopicIds } from '../Map/mapData'
import {
  TopicStyleFilterOptionKey,
  useQuery,
} from '../store/geschichte.TODO_ts'
import { createTopicStyleFilterOptionKey, splitTopicStyleKey } from '../utils'
import { changeFilter } from './utils'

type Props = { scopeTopicId: MapDataConfigTopicIds }

export const SelectFilters: React.FC<Props> = ({ scopeTopicId }) => {
  const {
    values: { selectedStyleKeys, selectedStylesFilterOptionKeys },
    pushState,
  } = useQuery()
  const checkboxScope = 'filter'

  // TODO Extracting the different IDs, Keys and objects form state and mapDataConfig
  // feels too hacky.
  const selectedStyleKey = selectedStyleKeys?.find((s) =>
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

    pushState((state) => {
      state.selectedStylesFilterOptionKeys = changeFilter({
        selectedStylesFilterOptionKeys,
        changeKey: filterKey,
        state,
      })
    })
  }

  if (!selectedStyleKeys || !selectedStylesFilterOptionKeys) return null
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

                  if (filter.inputType === 'checkbox') {
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
                  }

                  return (
                    <SelectEntryRadiobutton
                      scope={checkboxScope}
                      key={key}
                      id={key}
                      label={option.name}
                      active={active}
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
