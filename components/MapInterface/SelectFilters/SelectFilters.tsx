import React from 'react'
import { cleanupTargetIdFromEvent } from '../Map/utils'
import { addGeschichte, replaceGeschichte } from '../store'
import { TopicStyleFilterKey, useQuery } from '../store/geschichte'
import { splitTopicStyleFilterKey } from '../utils'
import { flattenedTopicStylesAndId } from './utils'

export const SelectFilters: React.FC = () => {
  // return null
  const {
    values: { selectedStyleKeys, selectedStylesFilterKeys },
    pushState,
  } = useQuery()
  const checkboxScope = 'filter'

  const activeStyles = flattenedTopicStylesAndId().filter((s) => {
    return selectedStyleKeys.includes(s.id)
  })
  const activeStylesWithFilter = activeStyles.filter(
    (s) => s.interactiveFilters?.length
  )

  // console.log({
  //   activeStylesWithFilter,
  //   activeStyles,
  //   selectedStyleKeys,
  //   selectedStylesFilterKeys,
  // })
  if (!activeStylesWithFilter.length) return null

  // We don't have a structure mapData object at this point
  // Which is why we need to recreate it based on the selectedStyle(Keys)-Array
  // This is also where we filter a styles with no interactiveFilter.
  // const relevantTopicsStyles = selectedStyleKeys
  //   .map((key) => {
  //     const [topicKey, styleKey] = splitTopicStyleKey(key)
  //     const topics = mapDataConfig?.topics
  //       ?.filter((t) => t.id === topicKey)
  //       ?.map((t) => t.styles?.filter((s) => s.id === styleKey))
  //     return topics?.some((t) =>
  //       t.styles?.some((s) => s.interactiveFilters?.length)
  //     )
  //       ? topics
  //       : undefined
  //   })
  //   .filter(Boolean)

  const visible = false //!!relevantTopicsStyles.length
  if (!visible) return null

  // TODO We need to handle setting all filter by default here…
  const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const filterId = cleanupTargetIdFromEvent(
      event,
      checkboxScope
    ) as TopicStyleFilterKey
    const [topicId] = splitTopicStyleFilterKey(filterId)
    const previousSelectedStyle = selectedStylesFilterKeys.find((s) =>
      s.startsWith(topicId)
    )
    if (previousSelectedStyle) {
      pushState((state) => {
        state.selectedStylesFilterKeys = replaceGeschichte<TopicStyleFilterKey>(
          state.selectedStylesFilterKeys,
          filterId,
          previousSelectedStyle
        )
      })
    } else {
      pushState((state) => {
        state.selectedStylesFilterKeys = addGeschichte<TopicStyleFilterKey>(
          state.selectedStylesFilterKeys,
          filterId
        )
      })
    }
  }

  return (
    <section>
      {/* <h2 className="text-base font-medium text-gray-900 mb-4">Filter</h2>
      {relevantTopicsStyles.map((style) => {
        if (!style) return null
        return (
          <form key={style.id} className="mb-5" onChange={onChange}>
            <h2 className="text-base font-medium text-gray-900 mb-3">
              Filter für {style.name}
            </h2>
            <fieldset>
              <legend className="sr-only">Stile für {style.name}</legend>
              <div className="space-y-2.5">
                {style.interactiveFilters.map((filter) => {
                  const topicId = mapDataConfig.topics.find(t => t.styles.find(style.)
                  const key = createTopicStyleFilterKey(topicId, style.id, filter.id)
                  const active = selectedStylesFilterKeys.includes(key)
                  return (
                    <SelectEntryCheckbox
                      scope={checkboxScope}
                      key={key}
                      id={key}
                      label={filter.name}
                      active={active}
                    />
                  )
                })}
              </div>
            </fieldset>
          </form>
        )
      })} */}
    </section>
  )
}

//   const {
//     values: { selectedTopicIds },
//   } = useQuery()
//   const { selectedFilters, addFilter, removeFilter } = useStore(useStoreMap)
//   const radioButtonScope = 'filter'

//   const onChange = (event: React.ChangeEvent<HTMLFormElement>) => {
//     const filterId = cleanupTargetId(
//       event,
//       radioButtonScope
//     ) as FilterUnfallatlassYearKeys

//     if (selectedFilters?.includes(filterId)) {
//       removeFilter(filterId)
//     } else {
//       addFilter(filterId)
//     }
//   }

//   const filterIds = Object.keys(
//     filterUnfallatlassYears
//   ) as FilterUnfallatlassYearKeys[]

//   const available = selectedTopicIds?.includes('accidents')
//   console.log({ selectedTopicIds, available, selectedFilters })

//   if (!available) return null

//   return (
//     <form onChange={onChange}>
//       <h2 className="text-base font-medium text-gray-900">Filter</h2>
//       <fieldset className="mt-4">
//         <legend className="sr-only">Filter</legend>
//         <div className="space-y-2.5">
//           {filterIds.map((key) => {
//             const { displayName } = filterUnfallatlassYears[key]
//             const active = !!selectedFilters && selectedFilters.includes(key)
//             // The filter list must have one entry, otherwise the map style fails
//             // so we disable the last active one.
//             const disabled = !!active && selectedFilters.length === 1
//             return (
//               <SelectEntryCheckbox
//                 scope={radioButtonScope}
//                 key={key}
//                 id={key}
//                 label={displayName}
//                 active={active}
//                 disabled={disabled}
//               />
//             )
//           })}
//         </div>
//       </fieldset>
//     </form>
//   )
// }
