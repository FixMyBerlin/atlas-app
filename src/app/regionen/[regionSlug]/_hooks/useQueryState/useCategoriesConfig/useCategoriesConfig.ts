import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { searchParamsRegistry } from '../searchParamsRegistry'
import { createFreshCategoriesConfig } from './createFreshCategoriesConfig'
import { configCustomParse } from './parser/configCustomParse'
import { configCustomStringify } from './parser/configCustomStringify'
import { MapDataCategoryConfig } from './type'

export const useCategoriesConfig = () => {
  const region = useStaticRegion()
  const freshConfig = createFreshCategoriesConfig(region?.categories ?? [])

  const configParamParser = createParser({
    parse: (query: string) => configCustomParse(query, freshConfig) as MapDataCategoryConfig[],
    serialize: (value: MapDataCategoryConfig[]) => configCustomStringify(value),
  })
    .withOptions({ history: 'push' })
    .withDefault(freshConfig)

  const [categoriesConfig, setCategoriesConfig] = useQueryState(
    searchParamsRegistry.config,
    configParamParser,
  )

  return { categoriesConfig, setCategoriesConfig }
}
