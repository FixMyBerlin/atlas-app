import { LocationGenerics } from '@routes/routes'
import { useNavigate, useSearch } from '@tanstack/react-location'
import produce from 'immer'
import React from 'react'
import { getTopicData, themes, TopicIds } from '../mapData'
import { SelectFilters } from '../SelectFilters'
import { SelectStyles } from '../SelectStyles'
import { Toggle } from './Toggle'

export const SelectTopics: React.FC = () => {
  const navigate = useNavigate<LocationGenerics>()
  const { config: configThemesTopics, theme: themeId } =
    useSearch<LocationGenerics>()
  const themeData = themes.find((t) => t.id === themeId)
  const topicsConfig = configThemesTopics?.find(
    (th) => th.id === themeId
  )?.topics

  const toggleActive = (topicId: TopicIds) => {
    navigate({
      search: (old) => {
        const oldConfig = old?.config
        if (!oldConfig) return { ...old }
        return {
          ...old,
          config: produce(oldConfig, (draft) => {
            const topic = draft
              ?.find((th) => th.id === themeId)
              ?.topics.find((t) => t.id === topicId)
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
        <legend className="sr-only">
          Datensätze für die ausgewählte Themenkarte {themeData?.name}
        </legend>
        <div className="space-y-2.5">
          {topicsConfig.map((topicConfig) => {
            const topicData = getTopicData(topicConfig.id)
            if (!topicData) return null

            return (
              <div key={topicConfig.id}>
                <Toggle
                  active={topicConfig.active}
                  handleChange={() => toggleActive(topicConfig.id)}
                >
                  {topicData.name}
                </Toggle>
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
