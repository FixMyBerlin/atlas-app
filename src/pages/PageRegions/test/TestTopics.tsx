import { mapDataConfig } from '@components/MapInterface/mapData'
import { LocationGenerics } from '@routes/routes'
import { useNavigate, useSearch } from '@tanstack/react-location'
import React from 'react'
import produce from 'immer'
import { TestStyles } from './TestStyles'

export const TestTopics: React.FC = () => {
  const navigate = useNavigate<LocationGenerics>()
  const { config } = useSearch<LocationGenerics>()
  const data = mapDataConfig

  const toggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventTopicId = event.target.getAttribute('data-topicid')
    navigate({
      search: (old) => {
        const oldConfig = old?.config
        if (!oldConfig) return { ...old }
        return {
          ...old,
          config: produce(oldConfig, (draft) => {
            // const index = draft.findIndex((t) => t.id === eventTopicId)
            // draft[index].active = !draft[index].active
            const topic = draft.find((t) => t.id === eventTopicId)
            topic && (topic.active = !topic.active)
          }),
        }
      },
    })
  }

  return (
    <section>
      {config?.map((topic) => {
        return (
          <div key={topic.id}>
            <label>
              <input
                key={[topic.id, topic.active].join('-')}
                data-topicid={topic.id}
                onChange={toggleActive}
                type="checkbox"
                defaultChecked={topic.active}
              />
              {data.topics.find((t) => t.id == topic.id)?.name} ist{' '}
              {topic.active ? 'an' : 'aus'}
            </label>
            <TestStyles scopeTopicId={topic.id} />
          </div>
        )
      })}
    </section>
  )
}
