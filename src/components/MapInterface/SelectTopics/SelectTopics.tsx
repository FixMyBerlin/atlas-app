import { LocationGenerics } from '@routes/routes'
import { useNavigate, useSearch } from '@tanstack/react-location'
import produce from 'immer'
import React from 'react'
import { SelectEntryCheckbox } from '../components'
import { getTopicData } from '../mapData'
import { SelectFilters } from '../SelectFilters'
import { SelectStyles } from '../SelectStyles'

export const SelectTopics: React.FC = () => {
  const navigate = useNavigate<LocationGenerics>()
  const { config: configThemesTopics, theme: themeId } =
    useSearch<LocationGenerics>()
  const topicsConfig = configThemesTopics?.find(
    (th) => th.id === themeId
  )?.topics

  const toggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventTopicId = event.target.getAttribute('data-topicid')
    navigate({
      search: (old) => {
        const oldConfig = old?.config
        if (!oldConfig) return { ...old }
        return {
          ...old,
          config: produce(oldConfig, (draft) => {
            const topic = draft
              ?.find((th) => th.id === themeId)
              ?.topics.find((t) => t.id === eventTopicId)
            topic && (topic.active = !topic.active)
          }),
        }
      },
    })
  }

  if (!topicsConfig) return null

  return (
    <section className="fixed top-32 left-5 max-h-[calc(100vh-12rem)] w-60 overflow-y-auto overflow-x-visible rounded bg-white/90 px-3 pt-1 pb-3 shadow-md">
      <fieldset className="mt-4">
        <legend className="sr-only">Thema</legend>
        <div className="space-y-2.5">
          {topicsConfig.map((topicConfig) => {
            const topicData = getTopicData(topicConfig.id)
            if (!topicData) return null

            const rerenderKey = [topicConfig.id, topicConfig.active].join('-') // TODO – This feels hacky. Research solution.

            return (
              <div key={rerenderKey}>
                <SelectEntryCheckbox
                  scope="topic"
                  key={rerenderKey}
                  id={topicConfig.id}
                  dataTopicId={topicConfig.id}
                  label={topicData.name}
                  // desc={topicData.desc} // lets hide this for now
                  active={topicConfig.active}
                  onChange={toggleActive}
                />
                <SelectStyles scopeTopicId={topicConfig.id} />
                <SelectFilters scopeTopicId={topicConfig.id} />
              </div>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}
