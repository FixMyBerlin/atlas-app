import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Fragment, Suspense, useEffect, useState } from 'react'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { twJoin } from 'tailwind-merge'
import { Categories } from './Categories/Categories'
import { StaticDatasetCategories } from './StaticDatasets/StaticDatasetCategories'

const SidebarLayerControlsChildren = () => {
  return (
    <>
      <Suspense fallback={<SmallSpinner />}>
        <Categories />
      </Suspense>
      <Suspense fallback={<SmallSpinner />}>
        <StaticDatasetCategories />
      </Suspense>
    </>
  )
}

export const SidebarLayerControls = () => {
  const [isSmBreakpoitOrAbove, setIsSmBreakpoitOrAbove] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)')
    setIsSmBreakpoitOrAbove(mediaQuery.matches)

    const onMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsSmBreakpoitOrAbove(event.matches)
    }

    mediaQuery.addEventListener('change', onMediaQueryChange)
    return () => mediaQuery.removeEventListener('change', onMediaQueryChange)
  }, [])

  return (
    <section className="absolute left-0 top-0 z-10 max-h-full max-w-72 overflow-y-auto overflow-x-visible bg-white py-px  shadow-md">
      {isSmBreakpoitOrAbove ? (
        <SidebarLayerControlsChildren />
      ) : (
        <Disclosure as={Fragment} defaultOpen={false}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center gap-0.5 pr-3 text-sm font-semibold leading-none hover:bg-yellow-50">
                <ChevronDownIcon
                  className={twJoin(
                    open ? '' : '-rotate-90 transform',
                    'h-5 w-5 text-gray-700 hover:text-gray-900',
                  )}
                />
                <span>Kategorien</span>
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel static>
                  <SidebarLayerControlsChildren />
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      )}
    </section>
  )
}
