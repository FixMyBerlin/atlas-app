import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/(pages)/_components/regionUtils/useStaticRegion'
import { createInitialCategoriesConfig } from '../../_components/mapStateConfig/createMapRegionConfig'
import { CategoryConfig } from '../../_components/mapStateConfig/type'
import { configCustomParseAndInitialize } from './useConfigParamParser/configCustomParseAndInitialize'
import { configCustomStringifyV3 } from './useConfigParamParser/configCustomParserV3'

export const useConfigParam = () => {
  const region = useStaticRegion()
  const freshConfig = createInitialCategoriesConfig(region.categories)

  const configParamParser = createParser({
    parse: (query: string) =>
      configCustomParseAndInitialize(query, freshConfig) as CategoryConfig[],
    serialize: (value: CategoryConfig[]) => configCustomStringifyV3(value),
  })
    .withOptions({ history: 'push' })
    .withDefault(freshConfig)

  // ==========
  // What I would need here is something like…
  // ==========
  // const configParamParser = createParser({
  //   parse: (query: string) => customParse(query) as ThemeConfig[],
  //   serialize: (value: ThemeConfig[]) => customStringify(value),
  // })
  //   .withOptions({ history: 'push' })
  //   .withDefault((urlConfigFromFirstPageLoad) => {
  //     const freshConfig = createMapRegionConfig(region.themes)
  //     // This is my migration step.
  //     // It should only happen once when the hook is used first.
  //     // It takes the unknown param and performs cleanup and migration tasks.
  //     // To then return a propperly formatted config…
  //     const initializedConfig = initializeMapRegionConfig({
  //       freshConfig,
  //       urlConfig: urlConfigFromFirstPageLoad,
  //     })
  //     return initializedConfig
  //   })

  // ==========
  // OR, maybe more like this…
  // ==========
  // const freshConfig = createMapRegionConfig(region.themes)
  // const configParamParser = createParser({
  //   parse: (query: string) => customParse(query) as ThemeConfig[],
  //   serialize: (value: ThemeConfig[]) => customStringify(value),
  // })
  //   .withOptions({ history: 'push' })
  //   .withTransformation((urlConfigFromFirstPageLoad) => {
  //     const initializedConfig = initializeMapRegionConfig({
  //       freshConfig,
  //       urlConfig: urlConfigFromFirstPageLoad,
  //     })
  //     return initializedConfig
  //   })
  //   // In this case withDefaults would be more like the .then(…).error(…) "catch" case than handles null|undefined
  //   .withDefaults(freshConfig)

  const [configParam, setConfigParam] = useQueryState('config', configParamParser)

  console.log('#### useConfigParam', { initialConfig: freshConfig, configParam })

  // We assume that at this point the config is present, because we initialize the page with one
  return { configParam: configParam!, setConfigParam }
}
