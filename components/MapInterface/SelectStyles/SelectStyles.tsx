import React, { useEffect } from 'react'
import { SelectEntryRadiobutton } from '../components'
import { mapDataConfig, MapDataConfigTopicIds } from '../Map/mapData'
import { cleanupTargetIdFromEvent } from '../Map/utils'
import { addGeschichte, removeGeschichte, replaceGeschichte } from '../store'
import { TopicStyleKey, useQuery } from '../store/geschichte'
import { createTopicStyleKey, splitTopicStyleKey } from '../utils'

type Props = { topicId: MapDataConfigTopicIds }

export const SelectStyles: React.FC<Props> = ({ topicId }) => {
  const {
    values: { selectedTopicIds, selectedStyleKeys },
    pushState,
  } = useQuery()
  const radioButtonScope = 'styles'

  // NOTE: We _cannot_ use `useEffect` to update the selectedStyleKeys
  // based on changes in selectedTopicIds. There is some weird rewrite
  // behavior that will reset our useQuery store.
  // Instead, …
  // - we need to update the styles whenever we change topcis.
  // - we need to update the filters whenever we change styles.

  const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const styleKey = event.target.value as TopicStyleKey
    const [topicId] = splitTopicStyleKey(styleKey)

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
  }

  const activeTopicsWithMultipeStyles = mapDataConfig.topics.filter((t) => {
    return t.id === topicId && t.styles.length > 1
  })

  if (!activeTopicsWithMultipeStyles.length) return null

  return (
    <section className="mt-1 rounded border px-2 py-2.5">
      {activeTopicsWithMultipeStyles.map((topic) => {
        return (
          <form
            key={`${topic.id}-${selectedStyleKeys.join()}`}
            data-topicId={topicId}
          >
            <fieldset>
              <legend className="sr-only">Stile für {topic.name}</legend>
              <div className="space-y-2.5">
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
              </div>
            </fieldset>
          </form>
        )
      })}
    </section>
  )
}
