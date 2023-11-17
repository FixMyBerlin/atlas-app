import { createParser, useQueryState } from 'next-usequerystate'
import { customParse, customStringify } from './useConfigParamParser/customParseStringify'
import { ThemeConfig } from '../../_components/mapStateConfig/type'

export const useConfigParam = (initialConfig?: ThemeConfig[]) => {
  console.log('useConfigParam', initialConfig)

  const configParamParser = createParser({
    parse: (query: string) => customParse(query) as ThemeConfig[],
    serialize: (value: ThemeConfig[]) => customStringify(value),
  })
    .withOptions({ history: 'push' })
    .withDefault(initialConfig ?? [])

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

  // We assume that at this point the config is present, because we initialize the page with one
  return { configParam: configParam!, setConfigParam }
}
