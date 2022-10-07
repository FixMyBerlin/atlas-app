import { LocationGenerics } from '@routes/routes'
import { useNavigate, useSearch } from '@tanstack/react-location'
import produce from 'immer'
import React from 'react'
import { SelectEntryCheckbox, SelectEntryRadiobutton } from '../components'
import {
  getMapDataTopicFilter,
  getMapDataTopicStyle,
  MapDataConfigTopicIds,
} from '../mapData'
import { TopicConfig } from '../store'
import {
  createTopicStyleFilterKey,
  createTopicStyleFilterOptionKey,
} from '../utils'

type Props = { scopeTopicId: MapDataConfigTopicIds }

export const SelectFilters: React.FC<Props> = ({ scopeTopicId }) => {
  const navigate = useNavigate<LocationGenerics>()
  const { config: configTopics } = useSearch<LocationGenerics>()
  const topicConfig = configTopics?.find(
    (t) => t.id === scopeTopicId
  ) as TopicConfig

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventTopicId = event.target.getAttribute('data-topicid')
    const eventStyleId = event.target.getAttribute('data-styleid')
    const eventFilterId = event.target.getAttribute('data-filterid')
    const eventFilterOptionId = event.target.getAttribute('data-filteroptionid')

    navigate({
      search: (old) => {
        const oldConfig = old?.config
        if (!oldConfig) return { ...old }
        return {
          ...old,
          config: produce(oldConfig, (draft) => {
            const topic = draft.find((t) => t.id === eventTopicId)
            const style = topic?.styles.find((s) => s.id === eventStyleId)
            const filter = style?.filters?.find((f) => f.id === eventFilterId)
            const option = filter?.options.find(
              (o) => o.id === eventFilterOptionId
            )
            if (topic && style && filter && option) {
              const filterData = getMapDataTopicFilter(
                topic.id,
                style.id,
                filter.id
              )
              if (filterData?.inputType === 'radiobutton') {
                filter.options.forEach((fo) => (fo.active = false))
              }
              option.active = !option.active
            }
          }),
        }
      },
    })
  }

  if (!topicConfig) return null
  // Hide UI for inactive topics
  if (!topicConfig.active) return null
  // Hide UI for topics with only one style
  // if (topicConfig.styles.length === 1) return null

  const activeTopicStyleConfig = topicConfig.styles.find((s) => s.active)
  // Hide UI when no filter present for active style
  if (!activeTopicStyleConfig) return null
  if (!activeTopicStyleConfig.filters) return null
  if (activeTopicStyleConfig.filters.length === 0) return null

  const styleData = getMapDataTopicStyle(
    topicConfig.id,
    activeTopicStyleConfig.id
  )

  return (
    <section className="mt-1 rounded border px-2 py-2.5">
      <fieldset>
        <legend className="sr-only">Filter</legend>
        {styleData?.interactiveFilters?.map((filterData) => {
          const filterConfig = activeTopicStyleConfig?.filters?.find(
            (f) => f.id === filterData.id
          )

          if (!filterConfig) return null

          return (
            <details className="space-y-2.5" key={filterData.id}>
              <summary className="text-sm">Filter {filterData.name}</summary>
              <div className="space-y-2.5">
                {filterData.options.map((optionData) => {
                  const optionConfig = filterConfig?.options.find(
                    (o) => o.id === optionData.id
                  )
                  if (!optionConfig) return null

                  const scope = createTopicStyleFilterKey(
                    topicConfig.id,
                    activeTopicStyleConfig.id,
                    filterConfig.id
                  )
                  const key = createTopicStyleFilterOptionKey(
                    topicConfig.id,
                    activeTopicStyleConfig.id,
                    filterConfig.id,
                    optionConfig.id
                  )

                  if (filterData.inputType === 'checkbox') {
                    // The filter list must have one entry, otherwise the map style fails
                    // so we disable the last active one. Therefore, we disable the last active input.
                    const disabled =
                      filterConfig?.options?.filter((o) => o.active)?.length ===
                        1 && optionConfig.active

                    return (
                      <SelectEntryCheckbox
                        scope={scope}
                        key={key}
                        id={key}
                        dataTopicId={topicConfig.id}
                        dataStyleId={activeTopicStyleConfig.id}
                        dataFilterId={filterConfig.id}
                        dataFilterOptionId={optionConfig.id}
                        label={optionData.name}
                        active={optionConfig.active}
                        disabled={disabled}
                        onChange={onChange}
                      />
                    )
                  }
                  return (
                    <SelectEntryRadiobutton
                      scope={scope}
                      key={key}
                      id={key}
                      dataTopicId={topicConfig.id}
                      dataStyleId={activeTopicStyleConfig.id}
                      dataFilterId={filterConfig.id}
                      dataFilterOptionId={optionConfig.id}
                      label={optionData.name}
                      active={optionConfig.active}
                      onChange={onChange}
                    />
                  )
                })}
              </div>
            </details>
          )
        })}
      </fieldset>
    </section>
  )
}
