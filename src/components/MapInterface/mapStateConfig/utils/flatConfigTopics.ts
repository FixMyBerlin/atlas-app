import { ThemeConfig, TopicConfig } from '../type'

export const flatConfigTopics = (configThemesTopics: ThemeConfig[]) => {
  const configTopics: TopicConfig[] = []

  configThemesTopics.forEach((theme) =>
    theme.topics.map((topic) => {
      if (!configTopics.some((t) => t.id === topic.id)) {
        configTopics.push(topic)
      }
    })
  )
  return configTopics
}
