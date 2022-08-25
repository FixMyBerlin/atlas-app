import classNames from 'classnames'
import React from 'react'
import { EntryProps } from './types'

export const SelectEntryCheckbox: React.FC<EntryProps> = ({
  scope,
  id,
  label,
  desc,
  active,
  disabled,
}) => {
  const key = `${scope}-${id}`

  return (
    <div className="relative flex items-start group">
      <div className="flex h-5 items-center">
        <input
          id={key}
          aria-describedby={desc ? `${key}-description` : ''}
          name={scope}
          type="checkbox"
          className={classNames(
            'h-4 w-4 rounded border-gray-300 cursor-pointer',
            { 'text-indigo-600 focus:ring-indigo-500': !disabled },
            { 'text-gray-600': disabled }
          )}
          defaultChecked={active}
          disabled={disabled}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={key} className="cursor-pointer">
          <p className="font-medium text-gray-700">{label}</p>
          {!!desc && (
            <p
              id={`${key}-description`}
              className="text-gray-300 group-hover:text-gray-600 text-xs"
            >
              {desc}
            </p>
          )}
        </label>
      </div>
    </div>
  )
}
