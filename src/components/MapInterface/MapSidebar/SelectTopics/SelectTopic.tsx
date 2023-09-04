import * as Sentry from '@sentry/react' // https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/
import React from 'react'
import { ErrorRestartMap } from '../../ErrorRestartMap/ErrorRestartMap'
import { MapDataTheme, getTopicData } from '../../mapData'
import { ThemeConfig } from '../../mapStateConfig'
import { SelectStyles } from '../SelectStyles/SelectStyles'

type Props = { themeData: MapDataTheme; themeConfig: ThemeConfig }

export const SelectTopic: React.FC<Props> = ({ themeData, themeConfig }) => {
  if (!themeData.topics || !themeConfig.topics) return null

  return (
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
  )
}
