import { LocationGenerics } from '@routes/routes'
import * as Sentry from '@sentry/react' // https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { ErrorRestartMap } from '../../ErrorRestartMap/ErrorRestartMap'
import { MapDataTheme, getTopicData, themes } from '../../mapData'
import { ThemeConfig } from '../../mapStateConfig'
import { SelectStyles } from '../SelectStyles/SelectStyles'

export const SelectTopics: React.FC = () => {
  const { config: configThemes } = useSearch<LocationGenerics>()
  const activeThemes = configThemes?.filter((t) => t.active)

  if (!activeThemes?.length) return null

  return (
    <>
      {activeThemes.map((activeTheme) => {
        const themeData = themes.find((t) => t.id === activeTheme.id)
        if (!themeData) return null
        return (
          <SelectTopicsOneTheme
            key={themeData.id}
            themeData={themeData}
            themeConfig={activeTheme}
          />
        )
      })}
    </>
  )
}

type Props = { themeData: MapDataTheme; themeConfig: ThemeConfig }

export const SelectTopicsOneTheme: React.FC<Props> = ({ themeData, themeConfig }) => {
  if (!themeData.topics || !themeConfig.topics) return null

  return (
    <section>
      <Sentry.ErrorBoundary fallback={<ErrorRestartMap />}>
        <fieldset>
          <legend className="sr-only">Daten für das Thema {themeData.name}</legend>
          <div>
            {themeData.topics.map((themeDataTopic) => {
              const topicData = getTopicData(themeDataTopic.id)
              const topicConfig = themeConfig.topics.find((t) => t.id === themeDataTopic.id)
              if (!topicData || !topicConfig) return null
              return (
                <div
                  key={topicData.id}
                  className="mt-3 border-t border-gray-100 px-3 pt-2 first:mt-0 first:border-t-0"
                >
                  <span className="text-sm font-semibold leading-[17px] text-gray-900">
                    {topicData.name}
                  </span>

                  <SelectStyles
                    themeId={themeConfig.id}
                    topicData={topicData}
                    topicConfig={topicConfig}
                  />
                </div>
              )
            })}
          </div>
        </fieldset>
      </Sentry.ErrorBoundary>
    </section>
  )
}
