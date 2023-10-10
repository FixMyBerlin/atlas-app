'use client'

import { clsx } from 'clsx'
import React from 'react'
import { EntryProps } from './types'

export const SelectEntryRadiobutton: React.FC<EntryProps> = ({
  scope,
  id,
  dataTopicId,
  dataStyleId,
  dataFilterId,
  dataFilterOptionId,
  label,
  desc: _desc,
  active,
  disabled,
}) => {
  const key = `${scope}--${id}`

  return (
    <div key={key} className="flex items-center">
      <input
        id={key}
        name={scope}
        type="radio"
        className={clsx(
          'h-4 w-4 cursor-pointer rounded-full border-gray-300',
          { 'text-indigo-600 focus:ring-indigo-500': !disabled },
          { 'text-gray-600': disabled },
        )}
        defaultChecked={active}
        disabled={disabled}
        value={id}
        data-topicid={dataTopicId}
        data-styleid={dataStyleId}
        data-filterid={dataFilterId}
        data-filteroptionid={dataFilterOptionId}
      />
      <label
        htmlFor={key}
        className="ml-2.5 block cursor-pointer text-sm font-medium leading-4 text-gray-700"
      >
        {label}
      </label>
    </div>
  )
}
