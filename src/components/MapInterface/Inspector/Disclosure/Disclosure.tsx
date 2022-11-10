import React from 'react'
import {
  Disclosure as HeadlessUiDisclosure,
  Transition,
} from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

type Props = {
  title: string | React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export const Disclosure: React.FC<Props> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  return (
    <HeadlessUiDisclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <HeadlessUiDisclosure.Button
            className={classNames(
              'flex w-full justify-between border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-gray-900 hover:border-gray-500 hover:bg-yellow-100 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75',
              {
                'rounded-t-lg border border-b-gray-200 bg-gray-100': open,
              },
              { 'rounded-lg border': !open }
            )}
          >
            <h3>{title}</h3>
            <ChevronUpIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-gray-500`}
            />
          </HeadlessUiDisclosure.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <HeadlessUiDisclosure.Panel
              static
              className="overflow-clip rounded-b-lg border border-t-0 border-gray-300 text-sm text-gray-500"
            >
              {children}
            </HeadlessUiDisclosure.Panel>
          </Transition>
        </>
      )}
    </HeadlessUiDisclosure>
  )
}
