import { twJoin } from 'tailwind-merge'
import React from 'react'
import { EntryProps } from './types'

export const SelectEntryCheckbox: React.FC<EntryProps> = ({
  scope,
  id,
  dataSubcatId,
  dataStyleId,
  label,
  desc,
  active,
  disabled,
  onChange,
}) => {
  const key = `${scope}--${id}`

  return (
    <div className="group relative flex items-start">
      <div className="flex h-5 items-center">
        <input
          id={key}
          aria-describedby={desc ? `${key}-description` : ''}
          name={scope}
          type="checkbox"
          className={twJoin(
            'h-4 w-4 cursor-pointer rounded border-gray-300',
            disabled ? 'text-gray-600' : 'text-indigo-600 focus:ring-indigo-500',
          )}
          defaultChecked={active}
          disabled={disabled}
          // Radiobuttons need to be triggered on the <form>, Checkboxed on the <input>
          onChange={onChange}
          value={id}
          data-subcategoryid={dataSubcatId}
          data-styleid={dataStyleId}
        />
      </div>
      <div className="ml-2.5 text-sm">
        <label htmlFor={key} className="cursor-pointer">
          <p className="font-medium text-gray-700">{label}</p>
          {!!desc && (
            <p
              id={`${key}-description`}
              className="text-xs text-gray-300 group-hover:text-gray-600"
            >
              {desc}
            </p>
          )}
        </label>
      </div>
    </div>
  )
}
