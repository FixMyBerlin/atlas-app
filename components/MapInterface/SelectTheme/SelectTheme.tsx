import classNames from 'classnames'
import React from 'react'
import { themes } from '../Map/mapData/themesMapDataConfig'
import { useQuery } from '../store'

// Source https://tailwindui.com/components/application-ui/navigation/tabs#component-83b472fc38b57e49a566805a5e5bb2f7
export const SelectTheme = () => {
  const {
    values: { selectedThemeId },
    pushState,
  } = useQuery()
  const themeIds = themes.map((t) => t.id)

  const selectTheme = (themeId: string) => {
    pushState((state) => (state.selectedThemeId = themeId))
  }

  return (
    <section className="absolute z-10 top-3 left-5">
      <div className="sm:hidden">
        <label htmlFor="themeSelect" className="sr-only">
          Ein Thema auswählen
        </label>
        <select
          id="themeSelect"
          name="themeSelect"
          className="block w-full focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
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

      <div className="hidden sm:block">
        <nav
          className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
          aria-label="Thema auswhälen"
        >
          {themeIds.map((themeId, tabIdx) => {
            const theme = themes.find((t) => t.id == themeId)
            if (!theme) return null
            const active = selectedThemeId === themeId

            return (
              <button
                key={theme.name}
                onClick={() => selectTheme(themeId)}
                className={classNames(
                  active
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700',
                  tabIdx === 0 ? 'rounded-l-lg' : '',
                  tabIdx === themeIds.length - 1 ? 'rounded-r-lg' : '',
                  'group relative min-w-0 flex-0 overflow-hidden bg-white py-2 px-3 text-sm font-medium text-center whitespace-nowrap',
                  active ? 'bg-yellow-400' : 'hover:bg-gray-50 focus:z-10'
                )}
                disabled={active}
                aria-current={active ? 'page' : undefined}
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
