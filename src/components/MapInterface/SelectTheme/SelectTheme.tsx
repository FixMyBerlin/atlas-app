import { LocationGenerics } from '@routes/routes'
import { useNavigate, useSearch } from '@tanstack/react-location'
import classNames from 'classnames'
import { MapDataThemeIds, themes } from '../mapData/themesMapDataConfig'

// Source https://tailwindui.com/components/application-ui/navigation/tabs#component-83b472fc38b57e49a566805a5e5bb2f7
export const SelectTheme = () => {
  const { theme: selectedThemeId } = useSearch<LocationGenerics>()

  const navigate = useNavigate<LocationGenerics>()
  const selectTheme = (themeId: string) => {
    navigate({
      search: (old) => {
        return {
          ...old,
          theme: themeId as MapDataThemeIds,
        }
      },
    })
  }

  return (
    <section className="absolute top-3 left-5 z-10">
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
          defaultValue={selectedThemeId}
        >
          {themes.map((tab) => (
            <option value={tab.id} key={tab.id}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        <nav
          className="relative z-0 flex divide-x divide-gray-200 rounded-lg shadow-lg"
          aria-label="Thema auswhälen"
        >
          {themes.map((theme, index) => {
            if (!theme) return null
            const active = selectedThemeId === theme.id

            return (
              <button
                key={theme.name}
                onClick={() => selectTheme(theme.id)}
                className={classNames(
                  active
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700',
                  index === 0 ? 'rounded-l-lg' : '',
                  index === themes.length - 1 ? 'rounded-r-lg' : '',
                  'flex-0 group relative min-w-0 overflow-hidden whitespace-nowrap py-2 px-3 text-center text-sm font-medium',
                  active
                    ? 'bg-yellow-400'
                    : 'bg-white hover:bg-yellow-50 focus:z-10'
                )}
                disabled={active}
                aria-current={active ? 'page' : undefined}
                title={theme.desc}
              >
                <span>{theme.name}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    active ? 'bg-yellow-500' : 'bg-transparent',
                    'absolute inset-x-0 bottom-0 h-0.5'
                  )}
                />
              </button>
            )
          })}
        </nav>
      </div>
    </section>
  )
}
