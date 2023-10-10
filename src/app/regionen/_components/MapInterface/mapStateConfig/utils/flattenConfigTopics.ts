'use client'

import { ThemeConfig, TopicConfig } from '../type'

export const flattenConfigTopics = (configThemes: ThemeConfig[]) => {
  const configTopics: TopicConfig[] = []

  configThemes.forEach((theme) =>
    theme.topics.map((topic) => {
      if (!configTopics.some((t) => t.id === topic.id)) {
        configTopics.push(topic)
      }
    }),
  )
  return configTopics
}
