import React from 'react'
import { SelectEntryCheckbox } from '../components'
import { mapDataConfig, MapDataConfigTopicIds } from '../Map/mapData'
import { SelectFilters } from '../SelectFilters'
import { SelectStyles } from '../SelectStyles'
import {
  addGeschichte,
  removeGeschichte,
} from '../store/changeGeschichte/changeGeschichte'
import { GeschichteStore, TopicStyleKey, useQuery } from '../store/geschichte'
import { createTopicStyleKey } from '../utils'

export const SelectTopics: React.FC = () => {
  const {
    values: { selectedTopicIds },
    pushState,
  } = useQuery()
  // const [addInteractievLayerIds, removeInteractiveLayerIds] = useStore(useStoreMap)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const topicId = event.target.value as MapDataConfigTopicIds
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
    <section className="fixed top-32 left-5 max-h-[calc(100vh-12rem)] w-56 overflow-y-auto rounded bg-white/90 px-3 pt-1 pb-3 shadow-md">
      <fieldset className="mt-4">
        <legend className="sr-only">Thema</legend>
        <div className="space-y-2.5">
          {topicIds.map((topicId) => {
            const topic = mapDataConfig.topics.find((t) => t.id === topicId)
            if (!topic) return null

            // TODO – This feels hacky. Research solution.
            const keyThatRerendersOnceGeschichteIsReady = `${selectedTopicIds?.join(
              '-'
            )}-${topicId}`
            return (
              <div key={keyThatRerendersOnceGeschichteIsReady}>
                <SelectEntryCheckbox
                  scope={'topic'}
                  key={keyThatRerendersOnceGeschichteIsReady}
                  id={topicId}
                  label={topic.name}
                  desc={topic.desc}
                  active={!!selectedTopicIds?.includes(topicId)}
                  onChange={onChange}
                />
                <SelectStyles scopeTopicId={topicId} />
                <SelectFilters scopeTopicId={topicId} />
              </div>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}
