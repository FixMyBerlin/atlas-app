import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import React from 'react'
import { SourcesDatasetsIds } from '../mapData/sourcesMapData/sourcesDatasets.const'

type Props = {
  value: SourcesDatasetsIds
  name: string | React.ReactNode
}

// https://headlessui.com/react/listbox#styling-the-active-and-selected-option
export const ListOption: React.FC<Props> = ({ value, name }) => {
  return (
    <Listbox.Option
      value={value}
      className={({ active, selected }) =>
        clsx(
          'relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900',
          {
            'bg-yellow-50 text-yellow-900': active && !selected,
          },
          { 'bg-yellow-400': selected }
        )
      }
    >
      {({ active, selected }) => (
        <>
          <span className={clsx('block', active || selected ? 'font-medium' : 'font-normal')}>
            {name}
          </span>
          {!!selected && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
        </>
      )}
    </Listbox.Option>
  )
}
