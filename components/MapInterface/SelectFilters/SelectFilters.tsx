import React from 'react'
import { SelectEntryCheckbox } from '../components'
import { mapDataConfig } from '../Map/mapData'
import { cleanupTargetIdFromEvent } from '../Map/utils'
import { addGeschichte, removeGeschichte, replaceGeschichte } from '../store'
import { TopicStyleFilterOptionKey, useQuery } from '../store/geschichte'
import {
  createTopicStyleFilterOptionKey,
  splitTopicStyleFilterOptionKey,
} from '../utils'
import { flattenedTopicStylesAndId } from './utils'

export const SelectFilters: React.FC = () => {
  const {
    values: { selectedStyleKeys, selectedStylesFilterOptionKeys },
    pushState,
  } = useQuery()
  const checkboxScope = 'filter'

  const activeStyles = flattenedTopicStylesAndId().filter((s) => {
    return selectedStyleKeys.includes(s.id)
  })
  const activeStylesWithFilter = activeStyles.filter(
    (s) => s.interactiveFilters?.length
  )

  if (!activeStylesWithFilter.length) return null

  const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const filterKey = cleanupTargetIdFromEvent(
      event,
      checkboxScope
    ) as TopicStyleFilterOptionKey

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
    <section>
      <h2 className="text-base font-medium text-gray-900 mb-4">Filter</h2>
      {activeStylesWithFilter.map((style) => {
        const topic = mapDataConfig.topics.find((t) => t.id === style.topicId)
        if (!style || !topic || !style.interactiveFilters?.length) return null

        return style.interactiveFilters.map((filter) => {
          return (
            <form key={style.id} className="mb-5" onChange={onChange}>
              <h3 className="text-base font-medium text-gray-900 mb-3">
                Filtere {filter.name} von {topic.name}
              </h3>
              <fieldset>
                <legend className="sr-only">
                  Filtere {filter.name} von {topic.name}
                </legend>
                <div className="space-y-2.5">
                  {filter.options.map((option) => {
                    const key = createTopicStyleFilterOptionKey(
                      style.topicId,
                      style.originalId,
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
                      />
                    )
                  })}
                </div>
              </fieldset>
            </form>
          )
        })
      })}
    </section>
  )
}
