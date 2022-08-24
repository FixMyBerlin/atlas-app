import React from 'react'
import { SelectEntryCheckbox } from '../components'
import { mapDataConfig, MapDataConfigTopicIds } from '../Map/mapData'
import { cleanupTargetIdFromEvent } from '../Map/utils'
import { createTopicStyleKey } from '../utils'
import {
  addGeschichte,
  removeGeschichte,
} from '../store/changeGeschichte/changeGeschichte'
import { GeschichteStore, TopicStyleKey, useQuery } from '../store/geschichte'

export const SelectTopics: React.FC = () => {
  const {
    values: { selectedTopicIds },
    pushState,
  } = useQuery()
  // const [addInteractievLayerIds, removeInteractiveLayerIds] = useStore(useStoreMap)
  const radioButtonScope = 'topic'

  const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const topicId = cleanupTargetIdFromEvent(
      event,
      radioButtonScope
    ) as MapDataConfigTopicIds
    if (selectedTopicIds?.includes(topicId)) {
      pushState((state: GeschichteStore) => {
        // (A) Update topic-State
        state.selectedTopicIds = removeGeschichte<MapDataConfigTopicIds>(
          state.selectedTopicIds,
          topicId
        ) as MapDataConfigTopicIds[]
        // (B) Update style-State
        const selectedStyleToRemove = state.selectedStyleKeys.find((s) =>
          s.startsWith(topicId)
        )
        if (selectedStyleToRemove) {
          state.selectedStyleKeys = removeGeschichte<TopicStyleKey>(
            state.selectedStyleKeys,
            selectedStyleToRemove
          )
        }
      })
    } else {
      pushState((state: GeschichteStore) => {
        // (A) Update topic-State
        state.selectedTopicIds = addGeschichte(
          state.selectedTopicIds,
          topicId
        ) as MapDataConfigTopicIds[]
        // (B) Update style-State
        const styles = mapDataConfig.topics.find(
          (t) => t.id === topicId
        )?.styles
        if (styles) {
          state.selectedStyleKeys = addGeschichte(
            state.selectedStyleKeys,
            createTopicStyleKey(topicId, styles[0].id)
          )
        }
      })
    }
  }

  const topicIds = mapDataConfig.topics.map((t) => t.id)

  return (
    <form onChange={onChange}>
      <h2 className="text-base font-medium text-gray-900">Thema</h2>
      <fieldset className="mt-4">
        <legend className="sr-only">Thema</legend>
        <div className="space-y-2.5">
          {topicIds.map((key) => {
            const topic = mapDataConfig.topics.find((t) => t.id === key)
            if (!topic) return null

            // TODO – This feels hacky. Research solution.
            const keyThatRerendersOnceGeschichteIsReady = `${selectedTopicIds?.join(
              '-'
            )}-${key}`
            return (
              <SelectEntryCheckbox
                scope={radioButtonScope}
                key={keyThatRerendersOnceGeschichteIsReady}
                id={key}
                label={topic.name}
                desc={topic.desc}
                active={!!selectedTopicIds?.includes(key)}
              />
            )
          })}
        </div>
      </fieldset>
    </form>
  )
}
