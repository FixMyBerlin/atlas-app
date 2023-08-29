import { LocationGenerics } from '@routes/routes'
import * as Sentry from '@sentry/react' // https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { ErrorRestartMap } from '../ErrorRestartMap/ErrorRestartMap'
import { SelectLegend } from '../SelectLegend'
import { SelectStyles } from '../SelectStyles'
import { getTopicData, themes } from '../mapData'

export const SelectTopics: React.FC = () => {
  const { config: configThemesTopics, theme: themeId } = useSearch<LocationGenerics>()
  const themeData = themes.find((t) => t.id === themeId)
  const topicsConfig = configThemesTopics?.find((th) => th.id === themeId)?.topics

  if (!topicsConfig) return null

  return (
    <section className="absolute top-2.5 left-5 max-h-[calc(100vh-5.5rem)] w-60 overflow-y-auto overflow-x-visible rounded bg-white/90 pt-1 pb-3 shadow-md">
      <Sentry.ErrorBoundary fallback={<ErrorRestartMap />}>
        <fieldset>
          <legend className="sr-only">
            Datensätze für die ausgewählte Themenkarte {themeData?.name}
          </legend>
          <div>
            {topicsConfig.map((topicConfig) => {
              const topicData = getTopicData(topicConfig.id)
              if (!topicData) return null
              return (
                <div
                  key={topicConfig.id}
                  className="mt-3 border-t border-gray-100 px-3 pt-2 first:mt-0 first:border-t-0"
                >
                  <span className="text-sm font-semibold leading-[17px] text-gray-900">
                    {topicData.name}
                  </span>
                  <SelectStyles scopeTopicId={topicConfig.id} />
                  <SelectLegend scopeTopicId={topicConfig.id} />
                </div>
              )
            })}
          </div>
        </fieldset>
      </Sentry.ErrorBoundary>
    </section>
  )
}
