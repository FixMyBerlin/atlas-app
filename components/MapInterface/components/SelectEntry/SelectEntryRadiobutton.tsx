import classNames from 'classnames'
import React from 'react'
import { EntryProps } from './types'

export const SelectEntryRadibutton: React.FC<EntryProps> = ({
  scope,
  id,
  label,
  active,
  disabled,
}) => {
  const key = `${scope}-${id}`

  return (
    <div key={key} className="flex items-center">
      <input
        id={key}
        name={scope}
        type="radio"
        className={classNames(
          'h-4 w-4 rounded-full border-gray-300',
          { 'text-indigo-600 focus:ring-indigo-500': !disabled },
          { 'text-gray-600': disabled }
        )}
        defaultChecked={active}
        disabled={disabled}
      />
      <label
        htmlFor={key}
        className="ml-3 block text-sm font-medium leading-4 text-gray-700"
      >
        {label}
      </label>
    </div>
  )
}
