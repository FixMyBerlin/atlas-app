import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { SelectEntryCheckbox } from '../components'
import { getStyleData, TopicIds, TopicStyleLegendIds } from '../mapData'
import { createTopicStyleLegendKey } from '../utils'

type Props = { scopeTopicId: TopicIds }

export const SelectLegend: React.FC<Props> = ({ scopeTopicId }) => {
  const { config: configThemesTopics, theme: themeId } =
    useSearch<LocationGenerics>()
  const topicConfig = configThemesTopics
    ?.find((th) => th.id === themeId)
    ?.topics.find((t) => t.id === scopeTopicId)

  if (!topicConfig) return null
  // Hide UI for inactive topics
  if (!topicConfig.active) return null

  const activeTopicStyleConfig = topicConfig.styles.find((s) => s.active)
  // Hide UI when no legends present for active style
  if (!activeTopicStyleConfig) return null
  const styleData = getStyleData(topicConfig.id, activeTopicStyleConfig.id)
  const legends = styleData?.legends?.filter(
    (l) => l.id !== 'ignore' && l.name !== null
  )
  if (!legends) return null

  return (
    <section className="mt-1 rounded border px-2 py-2.5">
      <fieldset>
        <legend className="sr-only">Legende</legend>
        <div className="space-y-2.5">
          {legends.map((legendData) => {
            if (legendData.id === 'ignore') return null

            const key = createTopicStyleLegendKey(
              topicConfig.id,
              activeTopicStyleConfig.id,
              legendData.id as TopicStyleLegendIds
            )

            console.log('SelectLegend', { styleData, activeTopicStyleConfig })

            const disabled = false // TODO

            return (
              <SelectEntryCheckbox
                scope={'foo'} // TODO
                key={key}
                id={key}
                dataTopicId={topicConfig.id}
                dataStyleId={activeTopicStyleConfig.id}
                // dataLegendId={layer.id}
                label={legendData.name as string} // Guarded by the filter
                active={true} // TODO
                disabled={disabled}
                onChange={(event) => console.log({ event })}
              />
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}
