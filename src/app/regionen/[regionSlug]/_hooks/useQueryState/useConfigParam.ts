import { createParser, useQueryState } from 'next-usequerystate'
import { useStaticRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { createMapRegionConfig } from '../../_components/mapStateConfig/createMapRegionConfig'
import { ThemeConfig } from '../../_components/mapStateConfig/type'
import { customParseConfig, customStringify } from './useConfigParamParser/customParseStringify'

export const useConfigParam = () => {
  const region = useStaticRegion()
  const freshConfig = createMapRegionConfig(region?.themes ?? [])

  const configParamParser = createParser({
    parse: (query: string) => customParseConfig(query, freshConfig) as ThemeConfig[],
    serialize: (value: ThemeConfig[]) => customStringify(value),
  })
    .withOptions({ history: 'push' })
    .withDefault(freshConfig)

  const [configParam, setConfigParam] = useQueryState('config', configParamParser)

  // We assume that at this point the config is present, because we initialize the page with one
  return { configParam: configParam!, setConfigParam }
}
