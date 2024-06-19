import { createParser, useQueryState } from 'nuqs'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { searchParamsRegistry } from '../searchParamsRegistry'
import { createFreshCategoriesConfig } from './createFreshCategoriesConfig'
import { MapDataCategoryConfig } from './type'
import { parse } from './v2/parse'
import { serialize } from './v2/serialize'
import { memoize } from 'lodash'

const memoized = memoize(
  (data) => data,
  ({ categoriesConfig }) => JSON.stringify(categoriesConfig),
)

export const useCategoriesConfig = () => {
  const region = useStaticRegion()
  const freshConfig = createFreshCategoriesConfig(region?.categories ?? [])

  const configParamParser = createParser({
    parse: (query: string) => parse(query, freshConfig),
    serialize: (value: MapDataCategoryConfig[]) => serialize(value),
  })
    .withOptions({ history: 'push' })
    .withDefault(freshConfig)

  const [categoriesConfig, setCategoriesConfig] = useQueryState(
    searchParamsRegistry.config,
    configParamParser,
  )

  return memoized({ categoriesConfig, setCategoriesConfig })
}
