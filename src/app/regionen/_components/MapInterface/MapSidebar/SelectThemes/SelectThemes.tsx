import { useConfigParam } from 'src/app/regionen/_components/useQueryState/useConfigParam'
import { SelectTheme } from './SelectTheme'

export const SelectThemes = () => {
  const { configParam } = useConfigParam()

  if (!configParam) return null

  const activeThemeIds = configParam.filter((theme) => theme.active).map((theme) => theme.id)

  return (
    <nav className="relative z-0 flex flex-col divide-x divide-gray-200">
      {configParam.map((themeConfig) => {
        if (!themeConfig) return null
        const active = activeThemeIds.includes(themeConfig.id)

        return <SelectTheme key={themeConfig.id} themeConfig={themeConfig} active={active} />
      })}
    </nav>
  )
}
