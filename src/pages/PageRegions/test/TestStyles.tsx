import {
  mapDataConfig,
  MapDataConfigTopicIds,
} from '@components/MapInterface/Map/mapData'
import { LocationGenerics } from '@routes/routes'
import { useNavigate, useSearch } from '@tanstack/react-location'
import React from 'react'
import produce from 'immer'
import { is } from 'immer/dist/internal'

export const TestStyles: React.FC<{
  scopeTopicId: MapDataConfigTopicIds
}> = ({ scopeTopicId }) => {
  const navigate = useNavigate<LocationGenerics>()
  const { config } = useSearch<LocationGenerics>()

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
            // const topicIndex = draft.findIndex((t) => t.id === eventTopicId)
            // const styleIndex = draft[topicIndex].styles.findIndex(
            //   (s) => s.id === eventStyleId
            // )
            // draft[topicIndex].styles.forEach((s) => (s.active = false))
            // draft[topicIndex].styles[styleIndex].active =
            //   !draft[topicIndex].styles[styleIndex].active
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

  const topicIdIsActive = () => {
    if (!config) return false
    const index = config.findIndex((t: any) => t.id === scopeTopicId)
    return config[index].active
  }

  const scopedStyles = () => {
    if (!config) return []
    const index = config.findIndex((t) => t.id === scopeTopicId)
    return config[index].styles
  }

  if (!config) return null
  if (!topicIdIsActive()) return null
  if (!scopedStyles()) return null

  return (
    <section>
      Für {mapDataConfig.topics.find((t) => t.id == scopeTopicId)?.name}:{' '}
      <ul>
        {scopedStyles().map((style) => {
          const styleName = mapDataConfig.topics
            .find((t) => t.id == scopeTopicId)
            ?.styles.find((s) => s.id === style.id)?.name
          return (
            <li key={style.id}>
              <label>
                <input
                  name={scopeTopicId}
                  key={[style.id, style.active].join('-')}
                  data-topicid={scopeTopicId}
                  data-styleid={style.id}
                  onChange={toggleActive}
                  type="radio"
                  defaultChecked={style.active}
                />
                {styleName}: {style.active ? 'an' : 'aus'}
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
