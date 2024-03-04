import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { createFreshCategoriesConfig } from './createFreshCategoriesConfig'
import { MapDataCategoryConfig } from './type'
import { simplifyConfigForParams } from './parser/configCustomStringify'
import { mergeCategoriesConfig } from './parser/mergeCategoriesConfig'
import { parse } from './v2/parse'
import { serialize } from './v2/serialize'

export const useCategoriesConfig = () => {
  const region = useStaticRegion()
  const freshConfig = createFreshCategoriesConfig(region?.categories ?? [])

  const configParamParser = createParser({
    parse: (query: string) => parse(query) as MapDataCategoryConfig[],
    serialize: (value: MapDataCategoryConfig[]) => serialize(simplifyConfigForParams(value)),
  })
    .withOptions({ history: 'push' })
    .withDefault(freshConfig)

  const [urlConfig, setCategoriesConfig] = useQueryState('config', configParamParser)
  const categoriesConfig = mergeCategoriesConfig({
    freshConfig,
    urlConfig: (urlConfig || []) as MapDataCategoryConfig[],
  }) as MapDataCategoryConfig[]

  return { categoriesConfig, setCategoriesConfig }
}
