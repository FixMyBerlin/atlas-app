import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { createFreshCategoriesConfig } from './createFreshCategoriesConfig'
import { MapDataCategoryConfig } from './type'
import { configCustomStringify } from './parser/configCustomStringify'
import { configCustomParse } from './parser/configCustomParse'

export const useCategoriesConfig = () => {
  const region = useStaticRegion()
  const freshConfig = createFreshCategoriesConfig(region?.categories ?? [])

  const configParamParser = createParser({
    parse: (query: string) => configCustomParse(query, freshConfig) as MapDataCategoryConfig[],
    serialize: (value: MapDataCategoryConfig[]) => configCustomStringify(value),
  })
    .withOptions({ history: 'push' })
    .withDefault(freshConfig)

  const [categoriesConfig, setCategoriesConfig] = useQueryState('config', configParamParser)

  return { categoriesConfig, setCategoriesConfig }
}
