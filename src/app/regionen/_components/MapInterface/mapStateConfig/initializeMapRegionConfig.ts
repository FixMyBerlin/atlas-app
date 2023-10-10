'use client'

import { produce } from 'immer'
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
export const initializeMapRegionConfig = ({ freshConfig, urlConfig }: Props) => {
  // Case: Initial page render without an `urlConfig`.
  // Case: Whenever the customParse fails, we set `InvalidThemeConfig` so we can reset the config
  // Both: We set the first theme as active.
  if (!urlConfig || 'reset' in urlConfig) {
    return produce(freshConfig, (old) => {
      old?.[0] && (old[0].active = true)
    })
  }

  const mergedConfig = freshConfig.map((theme) => {
    const urlConfigTheme = urlConfig?.find((t) => t?.id === theme.id)

    return {
      id: theme.id,
      active: urlConfigTheme?.active || theme.active,
      topics: theme.topics.map((themeTopic) => {
        const urlConfigTopic = urlConfigTheme?.topics?.find((t) => t?.id === themeTopic.id)

        return {
          id: themeTopic.id,
          styles: themeTopic.styles.map((style) => {
            const urlConfigTopicStyle = urlConfigTopic?.styles?.find((s) => s.id === style.id)

            return {
              id: style.id,
              active: urlConfigTopicStyle ? urlConfigTopicStyle.active : style.active,
            }
          }),
        }
      }),
    }
  }) satisfies ThemeConfig[]

  return mergedConfig
}
