import React from 'react'
import { SelectEntryRadiobutton } from '../components'
import { mapDataConfig, MapDataConfigTopicIds } from '../Map/mapData'
import { changeFilter } from '../SelectFilters/utils'
import { addGeschichte, replaceGeschichte } from '../store'
import { TopicStyleKey, useQuery } from '../store/geschichte'
import {
  createTopicStyleFilterOptionKey,
  createTopicStyleKey,
  splitTopicStyleKey,
} from '../utils'

type Props = { scopeTopicId: MapDataConfigTopicIds }

export const SelectStyles: React.FC<Props> = ({ scopeTopicId }) => {
  const {
    values: { selectedStyleKeys, selectedStylesFilterOptionKeys },
    pushState,
  } = useQuery()
  const radioButtonScope = 'styles'

  // NOTE: We _cannot_ use `useEffect` to update the selectedStyleKeys
  // based on changes in selectedTopicIds. There is some weird rewrite
  // behavior that will reset our useQuery store.
  // Instead, …
  // - we need to update the styles whenever we change topcis.
  // - we need to update the filters whenever we change styles.

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const styleKey = event.target.value as TopicStyleKey
    const [topicId, styleId] = splitTopicStyleKey(styleKey)

    const previousSelectedStyle = selectedStyleKeys.find((s) =>
      s.startsWith(topicId)
    )
    if (previousSelectedStyle) {
      pushState((state) => {
        // (A) Update style-State
        state.selectedStyleKeys = replaceGeschichte<TopicStyleKey>(
          state.selectedStyleKeys,
          styleKey,
          previousSelectedStyle
        )
        // (B) Update filter-State
        // TODO
      })
    } else {
      pushState((state) => {
        // (A) Update style-State
        state.selectedStyleKeys = addGeschichte<TopicStyleKey>(
          state.selectedStyleKeys,
          styleKey
        )
        // (B) Update filter-State
        // TODO
      })
    }

    // Filter:
    const currentStyle = mapDataConfig.topics
      .find((t) => t.id === topicId)
      ?.styles.find((s) => s.id === styleId)

    console.log('c', { currentStyle })
    currentStyle?.interactiveFilters?.forEach((filter) => {
      console.log('a', { currentStyle, filter })
      filter.options
        .filter((o) => o.default)
        .forEach((option) => {
          const filterOptionKey = createTopicStyleFilterOptionKey(
            topicId,
            styleId,
            filter.id,
            option.id
          )
          console.log('b', { option, filterOptionKey })

          if (!filterOptionKey) return
          pushState((state) => {
            state.selectedStylesFilterOptionKeys = changeFilter({
              selectedStylesFilterOptionKeys,
              changeKey: filterOptionKey,
              state,
            })
          })
        })
    })
  }

  const activeTopicsWithMultipeStyles = mapDataConfig.topics.filter((t) => {
    return t.id === scopeTopicId && t.styles.length > 1
  })

  if (!activeTopicsWithMultipeStyles.length) return null

  if (!selectedStyleKeys || !selectedStylesFilterOptionKeys) return null
  return (
    <section className="mt-1 rounded border px-2 py-2.5">
      {activeTopicsWithMultipeStyles.map((topic) => {
        // TODO – This feels hacky. Research solution.
        const keyThatRerenders = `${topic.id}-${selectedStyleKeys.join()}`

        return (
          <fieldset key={keyThatRerenders}>
            <legend className="sr-only">Stile</legend>
            <details className="space-y-2.5">
              <summary className="text-sm">Stile</summary>
              {topic.styles.map((style) => {
                const key = createTopicStyleKey(topic.id, style.id)
                const active = selectedStyleKeys.includes(key)
                return (
                  <SelectEntryRadiobutton
                    scope={radioButtonScope}
                    key={key}
                    id={key}
                    label={style.name}
                    active={active}
                    onChange={onChange}
                  />
                )
              })}
            </details>
          </fieldset>
        )
      })}
    </section>
  )
}
