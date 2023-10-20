import { MapDataThemeIds } from '../mapData/themesMapData/themes.const'
import { getThemeData, getTopicData } from '../mapData/utils/getMapDataUtils'
import { ThemeConfig } from './type'

/**
 * @desc Our main state object per theme. It holds the `active`-values. Which are either the `defaultActive`s given by the configs (from files) or the current `active` values specified by the url config (User). Wording Convention: We use this `*Config` (eg `topicConfig) to reference this config and `*Data` (eg `topicData`) to reference the mapData object and holds static details like name, description and such.~~
 */
export const createMapRegionConfig = (regionThemeIds: MapDataThemeIds[]) => {
  // We want to preserve the sort order of `regionThemeIds`.
  const sortedThemesData = regionThemeIds.map((id) => getThemeData(id))

  return sortedThemesData.map((theme) => {
    return {
      id: theme.id,
      active: false, // TODO: We need to select one theme to be active. Maybe rework the regions config to specify which to activate right initially and pass this as activeThemeIds to this helper?
      topics: theme.topics.map((themeTopic) => {
        const topicData = getTopicData(themeTopic.id)
        return {
          id: themeTopic.id,
          styles: topicData.styles.map((style) => {
            return {
              id: style.id,
              active: style.id === themeTopic.defaultStyle,
            }
          }),
        }
      }),
    }
  }) as ThemeConfig[]
}
