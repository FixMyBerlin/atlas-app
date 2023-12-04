import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { createInitialCategoriesConfig } from '../../_components/mapStateConfig/createInitialCategoriesConfig'
import { CategoryConfig } from '../../_components/mapStateConfig/type'
import { configCustomParse, configCustomStringify } from './useConfigParamParser/configCustomParser'

export const useConfigParam = () => {
  const region = useStaticRegion()
  const freshConfig = createInitialCategoriesConfig(region?.categories ?? [])

  const configParamParser = createParser({
    parse: (query: string) => configCustomParse(query, freshConfig) as CategoryConfig[],
    serialize: (value: CategoryConfig[]) => configCustomStringify(value),
  })
    .withOptions({ history: 'push' })
    .withDefault(freshConfig)

  const [configParam, setConfigParam] = useQueryState('config', configParamParser)

  return { configParam, setConfigParam }
}
