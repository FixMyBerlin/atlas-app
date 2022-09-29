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
    <section className="absolute top-3 left-5 z-10">
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

      <div className="hidden sm:block">
        <nav
          className="relative z-0 flex divide-x divide-gray-200 rounded-lg shadow-lg"
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
