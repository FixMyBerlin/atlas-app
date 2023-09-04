import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import { SelectTheme } from './SelectTheme'

export const SelectThemes = () => {
  const { config: configThemes } = useSearch<LocationGenerics>()

  if (!configThemes) return null

  const activeThemeIds = configThemes.filter((theme) => theme.active).map((theme) => theme.id)

  return (
    <nav className="relative z-0 flex divide-x divide-gray-200 flex-col">
      {configThemes.map((themeConfig) => {
        if (!themeConfig) return null
        const active = activeThemeIds.includes(themeConfig.id)

        return <SelectTheme key={themeConfig.id} themeConfig={themeConfig} active={active} />
      })}
    </nav>
  )
}
