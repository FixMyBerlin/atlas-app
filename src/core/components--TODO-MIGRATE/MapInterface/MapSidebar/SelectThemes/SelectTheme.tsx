import { ThemeConfig } from 'src/core/components--TODO-MIGRATE/MapInterface/mapStateConfig'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import { LocationGenerics } from '@routes/routes'
import { useNavigate } from '@tanstack/react-location'
import { produce } from 'immer'
import { getThemeData } from '../../mapData'
import { useMapStateInteraction } from '../../mapStateInteraction'
import { SelectTopic } from '../SelectTopic/SelectTopic'
import { Toggle } from '../Toggle/Toggle'

type Props = { themeConfig: ThemeConfig; active: boolean }

export const SelectTheme = ({ themeConfig, active }: Props) => {
  const { resetInspector } = useMapStateInteraction()
  const themeData = getThemeData(themeConfig.id)

  const navigate = useNavigate<LocationGenerics>()
  const selectTheme = (themeId: string) => {
    resetInspector()
    navigate({
      search: (old) => {
        const oldConfig = old?.config
        if (!oldConfig) return { ...old }

        return {
          ...old,
          config: produce(oldConfig, (draft) => {
            const theme = draft.find((th) => th.id === themeId)
            if (theme) {
              theme.active = !theme.active
            }
          }),
        }
      },
    })
  }

  return (
    <Disclosure key={themeData.name}>
      {({ open }) => (
        <>
          <div className="mt-2 flex justify-between border-t border-t-gray-200 pt-2 first:mt-0 first:border-t-transparent">
            <Toggle active={active} handleChange={() => selectTheme(themeConfig.id)}>
              <h2 className="font-semibold">{themeData.name}</h2>
              <p className="mt-1 text-xs leading-3 text-gray-400">{themeData.desc}</p>
            </Toggle>
            <Disclosure.Button className="flex flex-none items-center justify-center border-l border-gray-200 px-1 text-yellow-500 hover:bg-yellow-50">
              {open ? (
                <ChevronDownIcon className="h-7 w-7" />
              ) : (
                <ChevronLeftIcon className="h-7 w-7" />
              )}
            </Disclosure.Button>
          </div>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel static>
              <SelectTopic themeData={themeData} themeConfig={themeConfig} disabled={!active} />
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
