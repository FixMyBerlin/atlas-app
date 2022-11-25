import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import React from 'react'
import { SourcesRasterIds } from '../mapData/sourcesMapData'

type Props = { value: SourcesRasterIds; name: string }

// https://headlessui.com/react/listbox#styling-the-active-and-selected-option
export const ListOption: React.FC<Props> = ({ value, name }) => {
  return (
    <Listbox.Option
      value={value}
      className={({ active, selected }) =>
        classNames(
          'relative select-none py-2 pl-10 pr-4 text-gray-900',
          {
            'cursor-pointer bg-yellow-50 text-yellow-900': active && !selected,
          },
          { 'bg-yellow-400': selected }
        )
      }
    >
      {({ active, selected }) => (
        <>
          <span
            className={classNames(
              'block truncate',
              active || selected ? 'font-medium' : 'font-normal'
            )}
          >
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
