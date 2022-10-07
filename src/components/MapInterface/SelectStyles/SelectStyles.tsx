import { LocationGenerics } from '@routes/routes'
import { useNavigate, useSearch } from '@tanstack/react-location'
import produce from 'immer'
import React from 'react'
import { SelectEntryRadiobutton } from '../components'
import {
  getMapDataTopic,
  getMapDataTopicStyle,
  MapDataConfigTopicIds,
} from '../mapData'
import { TopicConfig } from '../store'
import { createTopicStyleKey } from '../utils'

type Props = { scopeTopicId: MapDataConfigTopicIds }

export const SelectStyles: React.FC<Props> = ({ scopeTopicId }) => {
  const navigate = useNavigate<LocationGenerics>()
  const { config: configTopics } = useSearch<LocationGenerics>()
  const topicConfig = configTopics?.find(
    (t) => t.id === scopeTopicId
  ) as TopicConfig

  const toggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventTopicId = event.target.getAttribute('data-topicid')
    const eventStyleId = event.target.getAttribute('data-styleid')

    navigate({
      search: (old) => {
        const oldConfig = old?.config
        if (!oldConfig) return { ...old }
        return {
          ...old,
          config: produce(oldConfig, (draft) => {
            const topic = draft.find((t) => t.id === eventTopicId)
            if (topic) {
              const style = topic.styles.find((s) => s.id === eventStyleId)
              topic.styles.forEach((s) => (s.active = false))
              style && (style.active = !style.active)
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
  if (topicConfig.styles.length === 1) return null

  return (
    <section className="mt-1 rounded border px-2 py-2.5">
      <fieldset>
        <legend className="sr-only">Stile</legend>
        <details className="space-y-2.5">
          <summary className="text-sm">Stile</summary>
          {topicConfig.styles.map((styleConfig) => {
            const styleData = getMapDataTopicStyle(
              topicConfig.id,
              styleConfig.id
            )
            if (!styleData) return null

            const key = createTopicStyleKey(topicConfig.id, styleConfig.id)

            return (
              <SelectEntryRadiobutton
                scope="style"
                key={key}
                id={key}
                dataTopicId={topicConfig.id}
                dataStyleId={styleConfig.id}
                label={styleData.name}
                active={styleConfig.active}
                onChange={toggleActive}
              />
            )
          })}
        </details>
      </fieldset>
    </section>
  )
}
