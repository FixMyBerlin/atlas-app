import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { twJoin } from 'tailwind-merge'

type Props = {
  value: string // string = StaticDatasetsIds
  name: string | React.ReactNode
}

// https://headlessui.com/react/listbox#styling-the-active-and-selected-option
export const ListOption: React.FC<Props> = ({ value, name }) => {
  return (
    <Listbox.Option
      value={value}
      className={({ active, selected }) =>
        twJoin(
          'relative cursor-pointer select-none py-2 pl-10 pr-4 leading-tight text-gray-900',
          active && !selected ? 'bg-yellow-50 text-yellow-900' : '',
          selected ? 'bg-yellow-400' : '',
        )
      }
    >
      {({ active, selected }) => (
        <>
          <div className={twJoin(active || selected ? 'font-medium' : 'font-normal')}>{name}</div>
          {!!selected && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
        </>
      )}
    </Listbox.Option>
  )
}
