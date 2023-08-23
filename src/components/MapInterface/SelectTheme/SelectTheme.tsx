import { LocationGenerics } from '@routes/routes'
import { useNavigate, useSearch } from '@tanstack/react-location'
import { clsx } from 'clsx'
import { Toggle } from './Toggle'
import { getThemeData } from '../mapData'
import { MapDataThemeIds } from '../mapData/themesMapData'
import { useMapStateInteraction } from '../mapStateInteraction'

// Source https://tailwindui.com/components/application-ui/navigation/tabs#component-83b472fc38b57e49a566805a5e5bb2f7
export const SelectTheme = () => {
  const { config: configThemes, theme: themeId } = useSearch<LocationGenerics>()
  const { resetInspector } = useMapStateInteraction()

  const navigate = useNavigate<LocationGenerics>()
  const selectTheme = (themeId: string) => {
    resetInspector()
    navigate({
      search: (old) => {
        return {
          ...old,
          theme: themeId as MapDataThemeIds,
        }
      },
    })
  }

  if (!configThemes) return null

  return (
    <section>
      {/* Mobile */}
      <div className="sm:hidden">
        <label htmlFor="themeSelect" className="sr-only">
          Ein Thema auswählen
        </label>
        <select
          id="themeSelect"
          name="themeSelect"
          className="block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
          onChange={(event) => selectTheme(event.target.value)}
          // TODO Only the default state is selected on page load; not the selectedState (that only becomes available later)
          defaultValue={themeId}
        >
          {configThemes.map((themeConfig) => {
            const themeData = getThemeData(themeConfig.id)
            if (!themeConfig || !themeData) return null

            return (
              <option value={themeConfig.id} key={themeConfig.id}>
                {themeData.name}
              </option>
            )
          })}
        </select>
      </div>

      {/* Desktop */}
      <div className="hidden sm:inline-block">
        <nav
          className="relative z-0 flex divide-x divide-gray-200 rounded-lg shadow-lg"
          aria-label="Thema auswhälen"
        >
          {configThemes.map((themeConfig, index) => {
            const themeData = getThemeData(themeConfig.id)
            if (!themeConfig || !themeData) return null
            const active = themeId === themeConfig.id

            return (
              <div
                key={themeData.name}
                className={clsx(
                  active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                  index === 0 ? 'rounded-l-lg' : '',
                  index === configThemes.length - 1 ? 'rounded-r-lg' : '',
                  'flex-0 group relative min-w-0 overflow-hidden whitespace-nowrap py-2 px-3 text-center text-sm font-medium',
                  active ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-50 focus:z-10'
                )}
                aria-current={active ? 'page' : undefined}
                title={themeData.desc}
              >
                <Toggle active={active} handleChange={() => selectTheme(themeConfig.id)}>
                  {themeData.name}
                </Toggle>
                <span
                  aria-hidden="true"
                  className={clsx(
                    active ? 'bg-yellow-500' : 'bg-transparent',
                    'absolute inset-x-0 bottom-0 h-0.5'
                  )}
                />
              </div>
            )
          })}
        </nav>
      </div>
    </section>
  )
}
