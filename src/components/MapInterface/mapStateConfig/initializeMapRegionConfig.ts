import { ThemeConfig } from './type'

type InvalidThemeConfig = { reset: true }

type Props = {
  freshConfig: ThemeConfig[]
  urlConfig: ThemeConfig[] | undefined | InvalidThemeConfig
}

/**
 * @desc Use once to initialize the mapRegionConfig. Receives the config from URL and a fresh config from the current system. The fresh config is updated based on the information from the URL (when possible). Options from the URL that cannot be found in the fresh config, are dropped and fresh config defaults apply.
 * - If something was added since the URL was created, the options are added with new defaults
 * - If something was renamed since the URL was created, the options are ignored
 * - If the options stayed the same, the URL active states are preserved
 */
export const initializeMapRegionConfig = ({
  freshConfig,
  urlConfig,
}: Props) => {
  if (!urlConfig) return freshConfig
  // Whenever the customParse fails, we set `InvalidThemeConfig` so we can reset the config
  if ('reset' in urlConfig) return freshConfig

  const mergedConfig = freshConfig.map((theme) => {
    const urlConfigTheme = urlConfig?.find((t) => t?.id === theme.id)

    return {
      id: theme.id,
      topics: theme.topics.map((themeTopic) => {
        const urlConfigTopic = urlConfigTheme?.topics?.find(
          (t) => t?.id === themeTopic.id
        )

        return {
          id: themeTopic.id,
          active: urlConfigTopic ? urlConfigTopic.active : themeTopic.active,
          styles: themeTopic.styles.map((style) => {
            const urlConfigTopicStyle = urlConfigTopic?.styles?.find(
              (s) => s.id === style.id
            )

            return {
              id: style.id,
              active: urlConfigTopicStyle
                ? urlConfigTopicStyle.active
                : style.id === 'default',
              filters: style?.filters?.map((filter) => {
                return {
                  id: filter.id,
                  options: filter?.options?.map((option) => {
                    const urlConfigTopicStyleFilterOption =
                      urlConfigTopicStyle?.filters
                        ?.find((f) => f.id == filter.id)
                        ?.options?.find((o) => o?.id === option.id)

                    return {
                      id: option.id,
                      active: urlConfigTopicStyleFilterOption
                        ? urlConfigTopicStyleFilterOption.active
                        : option.active,
                    }
                  }),
                }
              }),
            }
          }),
        }
      }),
    }
  }) satisfies ThemeConfig[]

  // Cleanup the "filters: undefined" which the url config does not have
  mergedConfig.forEach((c) =>
    c.topics.forEach((t) => {
      t.styles.forEach((s) => {
        if (s.filters === undefined) {
          delete s.filters
        }
      })
    })
  )

  return mergedConfig
}
