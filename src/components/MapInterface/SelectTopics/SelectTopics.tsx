import { LocationGenerics } from '@routes/routes'
import { useNavigate, useSearch } from '@tanstack/react-location'
import produce from 'immer'
import React from 'react'
import { SelectEntryCheckbox } from '../components'
import { getMapDataTopic } from '../mapData'

export const SelectTopics: React.FC = () => {
  const navigate = useNavigate<LocationGenerics>()
  const { config: configTopics } = useSearch<LocationGenerics>()

  const toggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventTopicId = event.target.getAttribute('data-topicid')
    navigate({
      search: (old) => {
        const oldConfig = old?.config
        if (!oldConfig) return { ...old }
        return {
          ...old,
          config: produce(oldConfig, (draft) => {
            const topic = draft.find((t) => t.id === eventTopicId)
            topic && (topic.active = !topic.active)
          }),
        }
      },
    })
  }

  if (!configTopics) return null

  return (
    <section className="fixed top-32 left-5 max-h-[calc(100vh-12rem)] w-56 overflow-y-auto rounded bg-white/90 px-3 pt-1 pb-3 shadow-md">
      <fieldset className="mt-4">
        <legend className="sr-only">Thema</legend>
        <div className="space-y-2.5">
          {configTopics.map((topic) => {
            const topicData = getMapDataTopic(topic.id)
            if (!topicData) return null

            const rerenderKey = [topic.id, topic.active].join('-') // TODO – This feels hacky. Research solution.

            return (
              <div key={rerenderKey}>
                <SelectEntryCheckbox
                  scope="topic"
                  key={rerenderKey}
                  id={topic.id}
                  dataTopicId={topic.id}
                  label={topicData.name}
                  desc={topicData.desc}
                  active={topic.active}
                  onChange={toggleActive}
                />
                {/* <SelectStyles scopeTopicId={topicState.id} />
                <SelectFilters scopeTopicId={topicState.id} /> */}
              </div>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}
