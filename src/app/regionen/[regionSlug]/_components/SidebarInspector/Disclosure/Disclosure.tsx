import {
  DisclosureButton,
  DisclosurePanel,
  Disclosure as HeadlessUiDisclosure,
  Transition,
} from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { twJoin } from 'tailwind-merge'

type Props = {
  title: string | React.ReactNode
  objectId?: string
  statusIcon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export const Disclosure = ({
  title,
  objectId,
  statusIcon,
  children,
  defaultOpen = true,
}: Props) => {
  return (
    <HeadlessUiDisclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <DisclosureButton
            className={twJoin(
              'flex w-full justify-between border-gray-300 bg-gray-50 px-3 py-2 text-left text-sm font-semibold text-gray-900 hover:border-gray-500 hover:bg-yellow-100 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75',
              open ? 'rounded-t-lg border border-b-gray-200 bg-gray-100' : 'rounded-lg border',
            )}
          >
            <ChevronRightIcon
              className={twJoin('mr-2 h-5 w-5 text-gray-900', open ? 'rotate-90 transform' : '')}
            />
            <h3 className="w-full">
              <div className="flex w-full justify-between pr-3">
                <span>{title}</span>
                <div className="flex">
                  {statusIcon}
                  {!!objectId && (
                    <span
                      className={twJoin(
                        'inline-flex items-center rounded px-1 py-0 font-mono',
                        open ? 'bg-white' : 'bg-gray-100',
                      )}
                    >
                      #{objectId}
                    </span>
                  )}
                </div>
              </div>
            </h3>
          </DisclosureButton>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <DisclosurePanel
              static
              className="overflow-clip rounded-b-lg border border-t-0 border-gray-300 bg-gray-50 text-sm text-gray-500"
            >
              {children}
            </DisclosurePanel>
          </Transition>
        </>
      )}
    </HeadlessUiDisclosure>
  )
}
