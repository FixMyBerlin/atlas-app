import React from 'react'
import { SelectEntryCheckbox } from '../components'
import { mapDataConfig, MapDataConfigTopicIds } from '../Map/mapData'
import { SelectFilters } from '../SelectFilters'
import { SelectStyles } from '../SelectStyles'
import {
  addGeschichte,
  GeschichteStore,
  removeGeschichte,
  TopicStyleKey,
  useQuery,
} from '../store'
import { useMapDataConfigTopicsWithState } from '../store/mapDataConfigTopicsWithState'
import { createTopicStyleKey } from '../utils'

export const SelectTopics: React.FC = () => {
  const {
    values: {
      config,
      selectedTopicIds,
      selectedStyleKeys,
      selectedStylesFilterOptionKeys,
    },
    pushState,
  } = useQuery()

  const topicsWithState = useMapDataConfigTopicsWithState({
    selectedTopicIds,
    selectedStyleKeys,
    selectedStylesFilterOptionKeys,
  })
  // const [addInteractievLayerIds, removeInteractiveLayerIds] = useStore(useStoreMap)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const topicId = event.target.value as MapDataConfigTopicIds
    // (NEW) new ?config
    pushState((state: GeschichteStore) => {
      state.config &&
        state.config.forEach(
          (topic) =>
            topic.id === topicId &&
            (topic.active = selectedTopicIds?.includes(topicId))
        )
      console.log({ topicId, x: state.config, map: state.map.lng })
    })

    if (selectedTopicIds?.includes(topicId)) {
      pushState((state: GeschichteStore) => {
        // (A) Update topic-State
        state.selectedTopicIds = removeGeschichte<MapDataConfigTopicIds>(
          state.selectedTopicIds,
          topicId
        )

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
        state.selectedTopicIds = addGeschichte(state.selectedTopicIds, topicId)

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

    // // Filter:
    // const currentStyle = mapDataConfig.topics
    //   .find((t) => t.id === topicId)
    //   ?.styles.find((s) => s.id === styleId)

    // console.log('c', { currentStyle })
    // currentStyle?.interactiveFilters?.forEach((filter) => {
    //   console.log('a', { currentStyle, filter })
    //   filter.options
    //     .filter((o) => o.default)
    //     .forEach((option) => {
    //       const filterOptionKey = createTopicStyleFilterOptionKey(
    //         topicId,
    //         styleId,
    //         filter.id,
    //         option.id
    //       )
    //       console.log('b', { option, filterOptionKey })

    //       if (!filterOptionKey) return
    //       pushState((state) => {
    //         state.selectedStylesFilterOptionKeys = changeFilter({
    //           selectedStylesFilterOptionKeys,
    //           changeKey: filterOptionKey,
    //           state,
    //         })
    //       })
    //     })
    // })
  }

  if (!topicsWithState) return null

  return (
    <section className="fixed top-32 left-5 max-h-[calc(100vh-12rem)] w-56 overflow-y-auto rounded bg-white/90 px-3 pt-1 pb-3 shadow-md">
      <fieldset className="mt-4">
        <legend className="sr-only">Thema</legend>
        <div className="space-y-2.5">
          {topicsWithState.map((topicState) => {
            const topicData = mapDataConfig.topics.find(
              (t) => t.id === topicState.id
            )
            if (!topicData) return null

            // TODO – This feels hacky. Research solution.
            const keyThatRerendersOnceGeschichteIsReady = `${selectedTopicIds?.join(
              '-'
            )}-${topicState.id}`
            return (
              <div key={keyThatRerendersOnceGeschichteIsReady}>
                <SelectEntryCheckbox
                  scope={'topic'}
                  key={keyThatRerendersOnceGeschichteIsReady}
                  id={topicState.id}
                  label={topicData.name}
                  desc={topicData.desc}
                  active={topicState.active}
                  onChange={onChange}
                />
                <SelectStyles scopeTopicId={topicState.id} />
                <SelectFilters scopeTopicId={topicState.id} />
              </div>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}
