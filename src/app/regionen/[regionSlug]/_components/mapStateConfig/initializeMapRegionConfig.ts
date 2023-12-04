import { produce } from 'immer'
import { CategoryConfig, SubcategoryConfig } from './type'

type Props = {
  freshConfig: CategoryConfig[]
  urlConfig: CategoryConfig[] | undefined
}

/**
 * @desc Use once to initialize the mapRegionConfig. Receives the config from URL and a fresh config from the current system. The fresh config is updated based on the information from the URL (when possible). Options from the URL that cannot be found in the fresh config, are dropped and fresh config defaults apply.
 * - If something was added since the URL was created, the options are added with new defaults
 * - If something was renamed since the URL was created, the options are ignored
 * - If the options stayed the same, the URL active states are preserved
 */
export const initializeMapRegionConfig = ({ freshConfig, urlConfig }: Props) => {
  // Case: Initial page render without an `urlConfig`. We set the first category as active.
  if (!urlConfig) {
    return produce(freshConfig, (old) => {
      old?.[0] && (old[0].active = true)
    })
  }

  const mergedConfig = freshConfig.map((categoryConfig) => {
    const urlConfigCategory = urlConfig?.find((t) => t?.id === categoryConfig.id)

    return {
      id: categoryConfig.id,
      active: urlConfigCategory?.active || categoryConfig.active,
      subcategories: categoryConfig.subcategories.map((subcategoryConfigConfig) => {
        // What we get here as `subcategoryConfigConfig` is the `id`+`active`
        // object from src/app/regionen/[regionSlug]/_components/mapStateConfig/type.ts

        const urlConfigSubcat = urlConfigCategory?.subcategories?.find(
          (t) => t?.id === subcategoryConfigConfig.id,
        )

        return {
          id: subcategoryConfigConfig.id,
          styles: subcategoryConfigConfig.styles.map((style) => {
            const urlConfigSubcatStyle = urlConfigSubcat?.styles?.find((s) => s.id === style.id)

            return {
              id: style.id,
              active: urlConfigSubcatStyle ? urlConfigSubcatStyle.active : style.active,
            }
          }),
        }
      }),
    }
  }) satisfies CategoryConfig[]

  return mergedConfig
}
