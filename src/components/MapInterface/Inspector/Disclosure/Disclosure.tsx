import React from 'react'
import {
  Disclosure as HeadlessUiDisclosure,
  Transition,
} from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'

type Props = {
  title: string | React.ReactNode
  objectId?: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export const Disclosure: React.FC<Props> = ({
  title,
  objectId,
  children,
  defaultOpen = true,
}) => {
  return (
    <HeadlessUiDisclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <HeadlessUiDisclosure.Button
            className={clsx(
              'flex w-full justify-between border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-gray-900 hover:border-gray-500 hover:bg-yellow-100 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75',
              {
                'rounded-t-lg border border-b-gray-200 bg-gray-100': open,
              },
              { 'rounded-lg border': !open }
            )}
          >
            <h3 className="w-full">
              <div className="flex w-full justify-between pr-3">
                <span>{title}</span>
                {!!objectId && (
                  <span
                    className={clsx(
                      'rounded  px-1 py-0 font-mono',
                      open ? 'bg-white' : 'bg-gray-100'
                    )}
                  >
                    #{objectId}
                  </span>
                )}
              </div>
            </h3>
            <ChevronUpIcon
              className={clsx('h-5 w-5 text-gray-500', {
                'rotate-180 transform': open,
              })}
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
