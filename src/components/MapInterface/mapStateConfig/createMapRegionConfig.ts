import { Region } from '@fakeServer/index'
import { getThemeData, getTopicData } from '../mapData'
import { ThemeConfig } from './type'

export type Props = {
  regionThemeIds: Region['themes']
}

// TODO: Check if we should useMemo this; and find out how
// TODO: Check this @desc, its likely wront ATM
/**
 * @desc Our main state object per theme. ~~It holds the `active`-values. Which are either the `defaultActive`s given by the configs or the current `active` values specified by the UI/User. In our map, we use this object as `*Config` (eg `topicConfig) in parallel to a `*Data` (eg `topicData`) which represents the mapDataConfig object and holds static details like name, description and such.~~
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
