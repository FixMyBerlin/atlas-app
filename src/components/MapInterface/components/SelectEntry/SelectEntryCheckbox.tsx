import classNames from 'classnames'
import React from 'react'
import { EntryProps } from './types'

export const SelectEntryCheckbox: React.FC<EntryProps> = ({
  scope,
  id,
  label,
  active,
  disabled,
}) => {
  const key = `${scope}-${id}`

  return (
    <div className="relative flex items-start">
      <div className="flex h-5 items-center">
        <input
          id={key}
          // aria-describedby="comments-description"
          name={scope}
          type="checkbox"
          className={classNames(
            'h-4 w-4 rounded border-gray-300',
            { 'text-indigo-600 focus:ring-indigo-500': !disabled },
            { 'text-gray-600': disabled }
          )}
          defaultChecked={active}
          disabled={disabled}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={key} className="font-medium text-gray-700">
          {label}
        </label>
        {/* <p id="comments-description" className="text-gray-500">
            {desc}
          </p> */}
      </div>
    </div>
  )
}
