import { useStaticRegion } from '@/src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { createParser, useQueryState } from 'nuqs'
import { searchParamsRegistry } from '../searchParamsRegistry'
import { createMemoizer } from '../utils/createMemoizer'
import { createFreshCategoriesConfig } from './createFreshCategoriesConfig'
import { MapDataCategoryConfig } from './type'
import { parse } from './v2/parse'
import { serialize } from './v2/serialize'

const memoizer = createMemoizer()

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

  return memoizer({ categoriesConfig, setCategoriesConfig })
}
