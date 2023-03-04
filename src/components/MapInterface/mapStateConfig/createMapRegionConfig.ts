import { Region } from '@fakeServer/index'
import { getThemeData, getTopicData } from '../mapData'
import { ThemeConfig } from './type'

type Props = {
  regionThemeIds: Region['themes']
}

/**
 * @desc Our main state object per theme. It holds the `active`-values. Which are either the `defaultActive`s given by the configs (from files) or the current `active` values specified by the url config (User). Wording Convention: We use this `*Config` (eg `topicConfig) to reference this config and `*Data` (eg `topicData`) to reference the mapData object and holds static details like name, description and such.~~
 * @attr `region` Which themes we show is specified per region. In turn the theme specifies which topcis to show.
 */
export const createMapRegionConfig = ({ regionThemeIds }: Props) => {
  // We want to preserve the sort order of `regionThemeIds`.
  const sortedThemesData = regionThemeIds.map((id) => getThemeData(id))

  return sortedThemesData.map((theme) => {
    return {
      id: theme.id,
      topics: theme.topics.map((themeTopic) => {
        const topicData = getTopicData(themeTopic.id)
        return {
          id: themeTopic.id,
          active: themeTopic.defaultActive,
          styles: topicData.styles.map((style) => {
            return {
              id: style.id,
              active: style.id === 'default',
              filters: style?.interactiveFilters?.map((filter) => {
                return {
                  id: filter.id,
                  options: filter.options.map((option) => {
                    return {
                      id: option.id,
                      active: option.defaultActive,
                    }
                  }),
                }
              }),
            }
          }),
        }
      }),
    }
  }) as ThemeConfig[]
}
