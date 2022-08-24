import React, { useEffect } from 'react'
import { SelectEntryRadibutton } from '../components'
import { mapDataConfig, MapDataConfigTopicIds } from '../Map/mapData'
import { cleanupTargetIdFromEvent } from '../Map/utils'
import { addGeschichte, removeGeschichte, replaceGeschichte } from '../store'
import { TopicStyleKey, useQuery } from '../store/geschichte'
import { createTopicStyleKey, splitTopicStyleKey } from '../utils'

export const SelectStyles: React.FC = () => {
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
    const styleId = cleanupTargetIdFromEvent(
      event,
      radioButtonScope
    ) as TopicStyleKey
    const topicId = styleId.split('-')[0] as MapDataConfigTopicIds

    const previousSelectedStyle = selectedStyleKeys.find((s) =>
      s.startsWith(topicId)
    )
    if (previousSelectedStyle) {
      pushState((state) => {
        state.selectedStyleKeys = replaceGeschichte<TopicStyleKey>(
          state.selectedStyleKeys,
          styleId,
          previousSelectedStyle
        )
      })
    } else {
      pushState((state) => {
        state.selectedStyleKeys = addGeschichte<TopicStyleKey>(
          state.selectedStyleKeys,
          styleId
        )
      })
    }
  }

  const activeTopicsWithMultipeStyles = mapDataConfig.topics.filter((t) => {
    return (
      selectedTopicIds.includes(t.id) &&
      // only when more than one style
      mapDataConfig.topics.filter(
        (t2) => t.id === t2.id && t2.styles.length > 1
      ).length
    )
  })

  return (
    <section>
      <h2 className="text-base font-medium text-gray-900 mb-4">Kartenstile</h2>
      {activeTopicsWithMultipeStyles.map((topic) => {
        return (
          <form
            key={`${topic.id}-${selectedStyleKeys.join()}`}
            className="mb-5"
            onChange={onChange}
          >
            <h2 className="text-base font-medium text-gray-900 mb-3">
              Stile für {topic.name}
            </h2>
            <fieldset>
              <legend className="sr-only">Stile für {topic.name}</legend>
              <div className="space-y-2.5">
                {topic.styles.map((style) => {
                  const key = createTopicStyleKey(topic.id, style.id)
                  const active = selectedStyleKeys.includes(key)
                  return (
                    <SelectEntryRadibutton
                      scope={radioButtonScope}
                      key={key}
                      id={key}
                      label={style.name}
                      active={active}
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
